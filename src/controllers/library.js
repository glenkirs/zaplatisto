const constants = require('../helpers/constants');
const errors = require('../helpers/errors');
const Utils = require('../helpers/utils');

/**
 * @api {get} /currency Получение валют
 * @apiGroup Library
 */
const getCurrency = async (ctx) => {
  ctx.body = Object.values(constants.currency).map((item, i) => {
    return {
      id: i,
      name: item
    }
  })
};

/**
 * @api {get} /billing Получение типов оплат
 * @apiGroup Library
 */
 const getBilling = async (ctx) => {
  ctx.body = Object.values(constants.billing).map((item, i) => {
    return {
      id: i,
      name: item
    }
  })
};

/**
 * @api {get} /template Получение шаблонов
 * @apiGroup Library
 */
 const getTemplate = async (ctx) => {
  ctx.body = Object.values(constants.template).map((item, i) => {
    return {
      id: i,
      name: item
    }
  })
};

/**
 * @api {get} /role Получение ролей пользователей
 * @apiGroup Library
 */
 const getRole = async (ctx) => {
  if(ctx.state.user && ctx.state.user.role == constants.roles.admin){
    ctx.body = Object.keys(constants.roles).map((item, i) => {
      return {
        id: i,
        name: item
      }
    })
  }else{
    throw new errors.NotFoundError(`Метод недоступен!`);
  }
};

/**
 * @api {get} /currency/list Получение курса валют от ЦБ + расчитаный процент проекта
 * @apiGroup Library
 */
 const getCurrencyCalc = async (ctx) => {
  ctx.body = await Utils.currencyList();
};

module.exports = {
  getCurrency,
  getCurrencyCalc,
  getBilling,
  getTemplate,
  getRole,
}