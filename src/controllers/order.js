const errors = require('../helpers/errors');
const models = require('../sequelize/models');
const constants = require('../helpers/constants');
const logger = require('../helpers/logger').getLogger();
const { _ } = require('lodash');
const { PayType, ApiManager, RequestHttpClient, InitPaymentResponsePayload } = require('@jfkz/tinkoff-payment-sdk');
const Request = require('request-promise-native');
const config = require('../config');

const Services = models.services;
const Plans = models.plans;
const PlansOptions = models.plans_options;
const Products = models.products;

/**
 * @api {post} /order Создание заказа
 * @apiGroup Orders
 */
const add = async (ctx) => {
    const body = ctx.request.body;
    if(_.has(ctx.state, 'user') && (ctx.state.user.role != constants.roles.admin || ctx.state.user.role != constants.roles.user)){
        throw new errors.ValidationError(`Авторизуйтесь или завершите регистрацию`, 'user');
    }
    if(!_.has(body, 'service')){
        throw new errors.ValidationError(`Не найдено поле service`, 'service');
    }
    if(!_.has(body, 'plan')){
        throw new errors.ValidationError(`Не найдено поле plan`, 'plan');
    }

    const service = await Services.findById(body.service);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    const plan = await Plans.findById(ctx.params.id);
    if(!plan){
        throw new errors.NotFoundError(`Тариф не найден`);
    }
    let product = false;
    if(_.has(body, 'product')){
        product = await Products.findById(ctx.params.product);
        if(!product){
            throw new errors.NotFoundError(`Продукт не найден`);
        }
    }
    let options = [];
    if(_.has(body, 'options') && _.isArray(body.options)){
        body.options.forEach(async (el, i) => {
            const elem = await PlansOptions.findById(el.id);
            if(!elem){
                throw new errors.NotFoundError(`Опция тарифа не найдена`);
            }
            options.push({
                id: elem.id,
                count: el.count
            });
        })
    }

    let total = 0;
    switch(service.template){
        case 0:
        case 1:
            break;
        case 2:
            break;
    }
    /*const ApiManagerInstance = new ApiManager({
        httpClient : new RequestHttpClient({
            request : Request
        }),
        terminalKey : config.payment.terminal,
        password : config.payment.password
    });

    ApiManagerInstance.initPayment({
        OrderId: '1',
        Amount: 10,
        PayType: PayType.SingleStage,
    }).then(data => {
        logger.debug('Init response:', data);
    });*/
    ctx.body = {
        'test': true
    };
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
