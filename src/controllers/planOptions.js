const errors = require('../helpers/errors');
const models = require('../sequelize/models');
const constants = require('../helpers/constants');
const { _ } = require('lodash');

const Plans = models.plans;
const PlansOptions = models.plans_options;

/**
 * @api {post} /plan/options Добавление опции тарифа
 * @apiGroup PlanOptions
 * @apiBody {String} [name] Название опции тарифа
 * @apiBody {Number} [price] цена
 * @apiBody {Number} [currency] ID валюты
 * @apiBody {Number} [plan] ID тарифа
 * @apiBody {Boolean} [is_active] Активность тарифа
 * @apiSuccess (200) {String} status Успешное добавление
 * @apiSuccess (200) {String} id ID добавленной опции тарифа
 */
const add = async (ctx) => {
    const body = ctx.request.body;
    if(!_.has(body, 'name') || (_.has(body, 'name') && body.name.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле name`, 'name');
    }
    if(!_.has(body, 'price') || !_.isNumber(body.price)){
        throw new errors.ValidationError(`Не найдено или не валидно поле price`, 'price');
    }
    if(!_.has(body, 'currency') || !_.isNumber(body.currency) || !Object.keys(constants.currency).includes(body.currency+'')){
        throw new errors.ValidationError(`Не найдено или не валидно поле currency`, 'currency');
    }
    if(!_.has(body, 'plan')){
        throw new errors.ValidationError(`Не найдено поле plan`, 'plan');
    }
    if(!_.has(body, 'is_active')){
        throw new errors.ValidationError(`Не найдено поле is_active`, 'is_active');
    }
    const plan = await Plans.findById(body.plan);
    if(!plan){
        throw new errors.NotFoundError(`Тарифный план не найден`, 'plan');
    }

    const plan_options = await PlansOptions.create({
        name: body.name,
        price: body.price,
        plan: plan.id,
        currency: body.currency,
        is_active: body.is_active ?? false,
    });
    ctx.body = {
        status: 'success',
        id: plan_options.id
    };
};

/**
 * @api {put} /plan/options/:id Редактирование опции тарифа
 * @apiGroup PlanOptions
 * @apiBody {String} [name] Название опции тарифа
 * @apiBody {Number} [price] цена
 * @apiBody {Number} [currency] ID валюты
 * @apiBody {Number} [plan] ID тарифа
 * @apiBody {Boolean} [is_active] Активность тарифа
 * @apiSuccess (200) {String} status Успешное редактирование
 */
const edit = async (ctx) => {
    const body = ctx.request.body;
    if(!_.has(body, 'name') || (_.has(body, 'name') && body.name.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле name`, 'name');
    }
    if(!_.has(body, 'price') || !_.isNumber(body.price)){
        throw new errors.ValidationError(`Не найдено или не валидно поле price`, 'price');
    }
    if(!_.has(body, 'currency') || !_.isNumber(body.currency) || !Object.keys(constants.currency).includes(body.currency+'')){
        throw new errors.ValidationError(`Не найдено или не валидно поле currency`, 'currency');
    }
    if(!_.has(body, 'plan')){
        throw new errors.ValidationError(`Не найдено поле plan`, 'plan');
    }
    if(!_.has(body, 'is_active')){
        throw new errors.ValidationError(`Не найдено поле is_active`, 'is_active');
    }

    const plan = await Plans.findById(body.plan);
    if(!plan){
        throw new errors.NotFoundError(`Тариф не найден`);
    }
    const plan_options = await PlansOptions.findById(ctx.params.id);
    if(!plan_options){
        throw new errors.NotFoundError(`Опция тарифа не найдена`);
    }

    await PlansOptions.update({
        name: body.name,
        price: body.price,
        plan: plan.id,
        currency: body.currency,
        is_active: body.is_active ?? false,
    },
    { where: { id: plan_options.id } })

    ctx.body = { status: 'success' };
};

/**
 * @api {delete} /plan/options/:id Удаление опции тарифа
 * @apiGroup PlanOptions
 * @apiBody {Number} [id] ID тарифа
 * @apiSuccess (200) {String} status Успешное удаление
 */
const remove = async (ctx) => {
    if(!_.has(ctx.params, 'id')){
        throw new errors.ValidationError(`Не найдено поле ID`, 'id');
    }
    const plan_options = await PlansOptions.findById(ctx.params.id);
    if(!plan_options){
        throw new errors.NotFoundError(`Опция тарифа не найдена`);
    }

    await PlansOptions.destroy({ where: { id: plan_options.id } });

    ctx.body = { status: 'success' };
};

/**
 * @api {get} /plan/options Получение опций тарифов
 * @apiQuery {Number} [plan] ID тарифа, фильтрация по тарифу
 * @apiQuery {Number} [is_active] 1/0 true/false фильтрация по активности опций тарифов
 * @apiGroup PlanOptions
 */
const getAll = async (ctx) => {
    ctx.body = await PlansOptions.getAllFront(ctx);
};

/**
 * @api {get} /plan/options/:id Получение тарифа
 * @apiGroup PlanOptions
 */
const getOne = async (ctx) => {
    const plan_options = await PlansOptions.getOneFront(ctx.params.id);
    if(!plan_options){
        throw new errors.NotFoundError(`Опция тарифа не найдена`);
    }
    ctx.body = plan_options;
};

module.exports = {
  add,
  edit,
  remove,
  getAll,
  getOne,
}
