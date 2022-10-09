const errors = require('../helpers/errors');
const moment = require('moment');
const utils = require('../helpers/utils');
const constants = require('../helpers/constants');
const token = require('../helpers/token');
const models = require('../sequelize/models');
const logger = require('../helpers/logger').getLogger();
const config = require('../config');
const smsc = require('../helpers/smsc_api');

const Users = models.users;
const SmsSend = models.sms_send;

smsc.configure({
  login : config.sms.login,
  password : config.sms.password,
  ssl : true,
});

/**
 * @api {post} /user/auth Авторизация пользователя
 * @apiDescription Проверяется авторизация пользователя, если он вводил код из СМС в течении 10 минут, то в ответе получаем token пользователя и status: 'auth'
 * во всех остальных случаях, отпраляется СМС
 * @apiGroup User
 * @apiBody {String} phone Телефон в формате 79992223344
 * @apiSuccess (200) {String} status  Если status == auth, пользователь авторизован, иначе перенаправлять на регистрацию (СМС уже отправлено).
 */
 const auth = async (ctx) => {
  const body = ctx.request.body;
  if(!body.phone || (body.phone && !utils.validatePhone(body.phone))){
    throw new errors.ValidationError(`Не найдено или не валидно поле phone`);
  }
  const sms = await SmsSend.findOneByPhone(body.phone);
  const user = await Users.findByPhone(body.phone);
  if(user && sms && sms.verify == 1 && utils.checkMinutes(sms.updatedAt) <= 10){
    ctx.body = {
      token: await token.generateToken(user.dataValues),
      status: 'auth'
    };
  }else if((sms && utils.checkMinutes(sms.updatedAt) >= 1) || !sms){
    smsc.get_balance((balance, raw, err, code) => {
      if(err) throw new errors.UnauthorizedError(`Ошибка авторизации в сервисе smsc.ru`);
      if(balance <= 1) throw new errors.ValidationError(`Недостаточно средств smsc.ru`);
    });
    const codeSms = utils.generateSmsCode();
    smsc.send_sms({
      phones : body.phone,
      mes : `Ваш код авторизации: ${codeSms}`,
      sender: 'zaplatisto'
    }, (data, raw, err, code) => {
      if(sms){
        SmsSend.update(
          { code: codeSms, verify: 0 },
          { where: { id: sms.id } }
        )
      }else{
        SmsSend.create({
          phone: body.phone,
          code: codeSms
        })
      }
    });
    ctx.body = { status: 'sms' };
  }else{
    ctx.body = { status: 'time' };
  }
};

/**
 * @api {post} /user/sms Отправка смс при регистрации либо при повторной отправке
 * @apiGroup User
 * @apiBody {String} phone Телефон в формате 79992223344
 * @apiSuccess (200) {String} send  Success - отправлено / time - ожидение не завершено (1 мин).
 */
 const sms = async (ctx) => {
  const body = ctx.request.body;
  if(!body.phone || (body.phone && !utils.validatePhone(body.phone))){
    throw new errors.ValidationError(`Не найдено или не валидно поле phone`);
  }

  const sms = await SmsSend.findOneByPhone(body.phone);
  if((sms && utils.checkMinutes(sms.updatedAt) >= 1) || !sms){
    smsc.get_balance((balance, raw, err, code) => {
      if(err) throw new errors.UnauthorizedError(`Ошибка авторизации в сервисе smsc.ru`);
      if(balance <= 1) throw new errors.ValidationError(`Недостаточно средств smsc.ru`);
    });
    const codeSms = utils.generateSmsCode();
    smsc.send_sms({
      phones : body.phone,
      mes : `Ваш код авторизации: ${codeSms}`,
      sender: 'zaplatisto'
    }, (data, raw, err, code) => {
      if(sms){
        SmsSend.update(
          { code: codeSms, verify: 0 },
          { where: { id: sms.id } }
        )
      }else{
        SmsSend.create({
          phone: body.phone,
          code: codeSms
        })
      }
    });
    ctx.body = { send: 'success' };
  }else{
    ctx.body = { send: 'time' };
  }
};

/**
 * @api {post} /user/sms/verify Подтверждение отправленного СМС кода
 * @apiGroup User
 * @apiBody {String} phone Телефон в формате 79992223344
 * @apiBody {String} code Код из СМС
 * @apiSuccess (200) {String} verify  Успешная верификация
 * @apiError verify Код не верный
 */
 const smsVerify = async (ctx) => {
  const body = ctx.request.body;
  if(!body.phone || (body.phone && !utils.validatePhone(body.phone))){
    throw new errors.ValidationError(`Не найдено или не валидно поле phone`);
  }
  const sms = await SmsSend.findOneByPhone(body.phone);
  const user = await Users.findByPhone(body.phone);
  if(sms && sms.code == body.code && utils.checkMinutes(sms.updatedAt) <= 10){
    SmsSend.update(
      { verify: 1 },
      { where: { id: sms.id } }
    )
    ctx.body = {
      verify: 'success',
      user: user ? 'auth' : 'register',
    };
  }else{
    ctx.body = { verify: 'error' };
  }
};

/**
 * @api {post} /user/register Регистрация пользователя
 * @apiDescription Конечная регистрация пользователя, после ввода пароля из СМС и заполнения формы с личными данными.
 * @apiGroup User
 * @apiBody {String} phone Телефон в формате 79992223344
 * @apiBody {String} name Имя
 * @apiBody {String} email E-mail
 * @apiSuccess (200) {String} status Успешная регистрация
 * @apiSuccess (200) {String} token  Bearer token.
 */
 const register = async (ctx) => {
  const body = ctx.request.body;
  if(!body.phone || (body.phone && !utils.validatePhone(body.phone))){
    throw new errors.ValidationError(`Не найдено или не валидно поле phone`);
  }
  if(!body.name || (body.name && body.name.length < 2)){
    throw new errors.ValidationError(`Не найдено или не валидно поле name`);
  }
  if(!body.email || (body.email && !utils.validateEmail(body.email))){
    throw new errors.ValidationError(`Не найдено или не валидно поле email`);
  }
  const user = await Users.findByPhone(body.phone);
  const sms = await SmsSend.findOneByPhone(body.phone);
  if(user && sms && sms.verify == 1 && utils.checkMinutes(sms.updatedAt) <= 10){
    Users.update(
      { name: body.name, email: body.email },
      { where: { id: user.id } }
    )
    ctx.body = {
      token: await token.generateToken(user.dataValues),
      status: 'auth'
    };
  }else if(!user && sms && sms.verify == 1 && utils.checkMinutes(sms.updatedAt) <= 10){
    await Users.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: constants.roles.user,
      balance: 0
    });
    const newUser = await Users.findByPhone(body.phone);
    ctx.body = {
      token: await token.generateToken(newUser.dataValues),
      status: 'auth'
    };
  }else{
    ctx.body = { status: 'error' };
  }
};

/**
 * @api {post} /user/info Информация о пользователе
 * @apiGroup User
 */
 const info = async (ctx) => {
  if(ctx.state.user && ctx.state.user.id){
    ctx.body = await Users.findById(ctx.state.user.id);
  }else{
    throw new errors.NotFoundError(`Пользователь не найден или не авторизован`);
  }
};

module.exports = {
  register,
  auth,
  info,
  sms,
  smsVerify,
}
