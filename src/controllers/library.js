const constants = require('../helpers/constants');
const errors = require('../helpers/errors');

/**
 * @api {get} /currency Получение валют
 * @apiGroup Library
 */
const getCurrency = async (ctx) => {
  ctx.body = constants.currency;
};

/**
 * @api {get} /billing Получение типов оплат
 * @apiGroup Library
 */
 const getBilling = async (ctx) => {
  ctx.body = constants.billing;
};

/**
 * @api {get} /template Получение шаблонов
 * @apiGroup Library
 */
 const getTemplate = async (ctx) => {
  ctx.body = constants.template;
};

/**
 * @api {get} /role Получение ролей пользователей
 * @apiGroup Library
 */
 const getRole = async (ctx) => {
  if(ctx.state.user && ctx.state.user.role == constants.roles.admin){
    ctx.body = constants.roles;
  }else{
    throw new errors.NotFoundError(`Метод недоступен!`);
  }
};

module.exports = {
  getCurrency,
  getBilling,
  getTemplate,
  getRole,
}