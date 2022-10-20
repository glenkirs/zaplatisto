const errors = require('../helpers/errors');
const models = require('../sequelize/models');
const constants = require('../helpers/constants');
const logger = require('../helpers/logger').getLogger();
const { _ } = require('lodash');
const Utils = require('../helpers/utils');

const Services = models.services;
const Plans = models.plans;
const Products = models.products;

/**
 * @api {post} /plan Добавление тарифа
 * @apiGroup Plans
 * @apiBody {String} [title] Название тарифа
 * @apiBody {Json} [descriptions] Описания тарифа в формате - ["Title", "Title1", "Title2"]
 * @apiBody {Json} [prices] Цены тарифного плана в формате - [{price:1000, currency:0, billing:1}, {price:1300, currency:1, billing:0}]
 * @apiBody {Number} [service] ID сервиса
 * @apiBody {Boolean} [is_active] Активность тарифа
 * @apiSuccess (200) {String} status Успешное добавление
 * @apiSuccess (200) {String} id ID добавленного тарифа
 */
const add = async (ctx) => {
    const body = ctx.request.body;
    if(!_.has(body, 'title') || (_.has(body, 'title') && body.title.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле title`, 'title');
    }
    if(!_.has(body, 'descriptions') || (_.has(body, 'descriptions') && !_.isArray(body.descriptions))){
        throw new errors.ValidationError(`Не найдено или не валидно поле descriptions`, 'descriptions');
    }
    if(!_.has(body, 'prices') || (_.has(body, 'prices') && !_.isArray(body.prices))){
        throw new errors.ValidationError(`Не найдено или не валидно поле prices`, 'prices');
    }
    if(_.has(body, 'prices') && _.isArray(body.prices)){
        body.prices.forEach((el) => {
            if(!_.has(el, 'price') || !_.has(el, 'currency') || !_.has(el, 'billing')){
                throw new errors.ValidationError(`Не валидно поле prices`, 'prices');
            }
            if(_.has(el, 'currency') && !Object.keys(constants.currency).includes(el.currency+'')){
                throw new errors.ValidationError(`Не валидно поле prices[].currency`, 'currency');
            }
            if(_.has(el, 'billing') && !Object.keys(constants.billing).includes(el.billing+'')){
                throw new errors.ValidationError(`Не валидно поле prices[].billing`, 'billing');
            }
        })
    }
    if(!_.has(body, 'service')){
        throw new errors.ValidationError(`Не найдено поле service`, 'service');
    }
    if(!_.has(body, 'is_active')){
        throw new errors.ValidationError(`Не найдено поле is_active`, 'is_active');
    }
    const service = await Services.findById(body.service);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    if(_.has(body, 'product')){
        const product = await Products.findById(body.product);
        if(!product){
            throw new errors.NotFoundError(`Продукт не найден`);
        }
    }

    const plan = await Plans.create({
        title: body.title,
        descriptions: body.descriptions,
        prices: body.prices,
        service: service.id,
        product: body.product ?? null,
        is_active: body.is_active ?? null,
    });
    ctx.body = {
        status: 'success',
        id: plan.id
    };
};

/**
 * @api {put} /plan/:id Редактирование тарифа
 * @apiGroup Plans
 * @apiBody {String} [title] Название тарифа
 * @apiBody {Json} [descriptions] Описания тарифа в формате - ["Title", "Title1", "Title2"]
 * @apiBody {Json} [prices] Цены тарифного плана в формате - [{price:1000, currency:0, billing:1}, {price:1300, currency:1, billing:0}]
 * @apiBody {Number} [service] ID сервиса
 * @apiBody {Number} [plan] ID тарифа
 * @apiBody {Boolean} [is_active] Активность тарифа
 * @apiSuccess (200) {String} status Успешное редактирование
 */
const edit = async (ctx) => {
    const body = ctx.request.body;
    if(!_.has(body, 'title') || (_.has(body, 'title') && body.title.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле title`, 'title');
    }
    if(!_.has(body, 'descriptions') || (_.has(body, 'descriptions') && !_.isArray(body.descriptions))){
        throw new errors.ValidationError(`Не найдено или не валидно поле descriptions`, 'descriptions');
    }
    if(!_.has(body, 'prices') || (_.has(body, 'prices') && !_.isArray(body.prices))){
        throw new errors.ValidationError(`Не найдено или не валидно поле prices`, 'prices');
    }
    if(_.has(body, 'prices') && _.isArray(body.prices)){
        body.prices.forEach((el) => {
            if(!_.has(el, 'price') || !_.has(el, 'currency') || !_.has(el, 'billing')){
                throw new errors.ValidationError(`Не валидно поле prices`, 'prices');
            }
            if(_.has(el, 'currency') && !Object.keys(constants.currency).includes(el.currency+'')){
                throw new errors.ValidationError(`Не валидно поле prices[].currency`, 'currency');
            }
            if(_.has(el, 'billing') && !Object.keys(constants.billing).includes(el.billing+'')){
                throw new errors.ValidationError(`Не валидно поле prices[].billing`, 'billing');
            }
        })
    }
    if(!_.has(body, 'service')){
        throw new errors.ValidationError(`Не найдено поле service`, 'service');
    }
    if(!_.has(ctx.params, 'id')){
        throw new errors.ValidationError(`Не найдено поле ID`, 'id');
    }
    if(!_.has(body, 'is_active')){
        throw new errors.ValidationError(`Не найдено поле is_active`, 'is_active');
    }

    const plan = await Plans.findById(ctx.params.id);
    if(!plan){
        throw new errors.NotFoundError(`Тариф не найден`);
    }
    const service = await Services.findById(body.service);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    if(_.has(body, 'product')){
        const product = await Products.findById(body.product);
        if(!product){
            throw new errors.NotFoundError(`Продукт не найден`);
        }
    }

    await Plans.update(
        {
            title: body.title,
            descriptions: body.descriptions,
            prices: body.prices,
            service: service.id,
            product: body.product ?? null,
            is_active: body.is_active ?? null,
        },
        { where: { id: plan.id } }
    )

    ctx.body = { status: 'success' };
};

/**
 * @api {delete} /plan/:id Удаление тарифа
 * @apiGroup Plans
 * @apiBody {Number} [id] ID тарифа
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
 * @api {get} /plan Получение тарифов
 * @apiGroup Plans
 */
const getAll = async (ctx) => {
    ctx.body = await Plans.getAllFront();
};

/**
 * @api {get} /plan/:id Получение тарифа
 * @apiGroup Plans
 */
const getOne = async (ctx) => {
    const plan = await Plans.getOneFront(ctx.params.id);
    if(!plan){
        throw new errors.NotFoundError(`Тариф не найден`);
    }
    ctx.body = plan;
};

module.exports = {
  add,
  edit,
  remove,
  getAll,
  getOne,
}
