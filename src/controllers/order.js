const errors = require('../helpers/errors');
const models = require('../sequelize/models');
const constants = require('../helpers/constants');
const logger = require('../helpers/logger').getLogger();
const { _ } = require('lodash');

const Services = models.services;
const Plans = models.plans;
const Products = models.products;

/**
 * @api {post} /order Создание заказа
 * @apiGroup Orders
 */
const add = async (ctx) => {
    ctx.body = {};
};

/**
 * @api {put} /order/:id Редактирование заказа
 * @apiGroup Orders
 */
const edit = async (ctx) => {
    ctx.body = {};
};

/**
 * @api {delete} /order/:id Удаление заказа
 * @apiGroup Orders
 * @apiBody {Number} [id] ID заказа
 * @apiSuccess (200) {String} status Успешное удаление
 */
const remove = async (ctx) => {
    if(!_.has(ctx.params, 'id')){
        throw new errors.ValidationError(`Не найдено поле ID`, 'id');
    }
    const plan = await Plans.findById(ctx.params.id);
    if(!plan){
        throw new errors.NotFoundError(`Тариф не найден`);
    }

    await Plans.destroy({ where: { id: plan.id } });

    ctx.body = { status: 'success' };
};

/**
 * @api {get} /order Получение заказов
 * @apiGroup Orders
 */
const getAll = async (ctx) => {
    ctx.body = {};
};

/**
 * @api {get} /order/:id Получение заказа
 * @apiGroup Orders
 */
const getOne = async (ctx) => {
    ctx.body = {};
};

module.exports = {
  add,
  edit,
  remove,
  getAll,
  getOne,
}
