const errors = require('../helpers/errors');
const utils = require('../helpers/utils');
const constants = require('../helpers/constants');
const models = require('../sequelize/models');
const logger = require('../helpers/logger').getLogger();
const config = require('../config');
const { _ } = require('lodash');

const UserAccount = models.user_accounts;

/**
 * @api {put} /user/accounts/:id Обновление аккаунта пользователя
 * @apiGroup UserAccounts
 * @apiBody {String} login Логин
 * @apiBody {String} password Пароль
 * @apiBody {Number} service Сервис аккаунта (опционально)
 * @apiSuccess (200) {String} status
 */
 const update = async (ctx) => {
  const body = ctx.request.body;
  let userAccount = false;
  if(_.has(ctx.state, 'user') && ctx.state.user.role == constants.roles.admin){
    userAccount = await UserAccount.getOneFront(ctx.params.id);
  }
  if(!_.has(body, 'login') && body.login.length < 2){
    throw new errors.ValidationError(`Не найдено поле login`, 'login');
  }
  if(!_.has(body, 'password') && body.password.length < 2){
    throw new errors.ValidationError(`Не найдено поле password`, 'password');
  }
  if(!userAccount){
    throw new errors.ValidationError(`Аккаунт не найден`, 'id');
  }
  
  if(user){
    const pass = CryptoJS.AES.encrypt(body.password, config.passSecret).toString();
    UserAccount.update(
      { login: body.login, password: pass, service: body.service ?? userAccount.service },
      { where: { id: userAccount.id } }
    )
    ctx.body = { status: 'success' };
  }else{
    ctx.body = { status: 'error' };
  }
};

/**
 * @api {delete} /user/accounts/:id Удаление аккаунта пользователя
 * @apiGroup UserAccounts
 * @apiSuccess (200) {String} status Успешное удаление
 */
 const deleteAccount = async (ctx) => {
  let userAccount = false;
  if(ctx.state.user && ctx.state.user.role == constants.roles.admin){
    userAccount = await UserAccount.getOneFront(ctx.params.id);
  }
  if(userAccount){
    await UserAccount.destroy({ where: { id: userAccount.id } });
    ctx.body = { status: 'success' };
  }else{
    throw new errors.ForbiddenError(`Аккаунт не найден`);
  }
};

/**
 * @api {get} /user/accounts/:id Информация об аккаунте пользователя
 * @apiGroup UserAccounts
 */
 const info = async (ctx) => {
  ctx.body = await UserAccount.getOneFrontByUser(ctx.params.id);
};

/**
 * @api {get} /user/accounts/:id Информация об аккаунте пользователя
 * @apiGroup UserAccounts
 */
 const decryptPass = async (ctx) => {
  const user_account = await UserAccount.getOneFront(ctx.params.id);
  if(user_account){
    const bytes  = CryptoJS.AES.decrypt(user_account.password, config.passSecret);
    ctx.body = {
      password: bytes.toString(CryptoJS.enc.Utf8)
    };
  }else{
    throw new errors.NotFoundError(`Аккаунт не найден`);
  }
};

/**
 * @api {get} /user/accounts Получение всех аккаунтов пользователей
 * @apiGroup UserAccounts
 * @apiBody {String} sort Если равен DESC - сортирует пользователей в обратном порядке по ID
 * @apiBody {String} after Курсор после которого нужно получить пользователей
 * @apiBody {String} before Курсор до которого нужно получить пользователей
 */
 const getAll = async (ctx) => {
  if(ctx.state.user && ctx.state.user.role == constants.roles.admin){
    ctx.body = await UserAccount.paginate({
      limit: 10,
      order: ctx.request.params.sort == 'DESC' ? ['id', 'DESC'] : ['id'],
      after: ctx.query.after,
      before: ctx.query.before,
    });
  }else{
    throw new errors.NotFoundError(`Пользователи не найдены`);
  }
};

module.exports = {
  info,
  decryptPass,
  update,
  deleteAccount,
  getAll,
}
