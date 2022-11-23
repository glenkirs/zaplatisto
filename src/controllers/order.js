const errors = require('../helpers/errors');
const models = require('../sequelize/models');
const constants = require('../helpers/constants');
const logger = require('../helpers/logger').getLogger();
const { _ } = require('lodash');
const { PayType, ApiManager, RequestHttpClient, InitPaymentResponsePayload } = require('@jfkz/tinkoff-payment-sdk');
const Request = require('request-promise-native');
const config = require('../config');
const Utils = require('../helpers/utils');
const CryptoJS = require('crypto-js');

const Services = models.services;
const Plans = models.plans;
const PlansOptions = models.plans_options;
const Products = models.products;
const UserAccount = models.user_accounts;
const Orders = models.orders;

/**
 * @api {post} /order Создание заказа
 * @apiGroup Orders
 * @apiBody {Number} [service] ID сервиса
 * @apiBody {Number} [plan] ID тарифа (необязатяельно для сервисов с шаблоном - "Пополнение по логину")
 * @apiBody {Number} [product] ID продукта (необязатяельно для сервисов с шаблоном - "Пополнение по логину")
 * @apiBody {Number} [members] Кол-во пользователей, необязательно. Доступно для тарифов, имеющие активный параметр is_members
 * @apiBody {Array} [options] Выбранные опции тарифа (необязатяельно) в формате - [{id:1, count:2}, {id:2, count:1}]
 * @apiBody {Json} [price] Объект цены тарифного плана в формате - {price:1000, currency:0, billing:1}
 * @apiBody {Json} [account] Объект аккаунта пользователя для сервиса в формате - {login:"user_email@mail.ru", password:"123123123"} (необязательно)
 * @apiBody {Float} [total] Итоговая цена на фронте
 */
const add = async (ctx) => {
    const body = ctx.request.body;
    if(!_.has(ctx.state, 'user') || (_.has(ctx.state, 'user') && ctx.state.user.role == constants.roles.guest)){
        throw new errors.ValidationError(`Авторизуйтесь или завершите регистрацию`, 'user');
    }
    if(!_.has(body, 'service')){
        throw new errors.ValidationError(`Не найдено поле service`, 'service');
    }
    const service = await Services.findById(body.service);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    if(!_.has(body, 'price') && service.template != 2){
        throw new errors.ValidationError(`Не найдено поле price`, 'price');
    }
    if(!_.has(body, 'plan') && service.template != 2){
        throw new errors.ValidationError(`Не найдено поле plan`, 'plan');
    }
    const plan = await Plans.findById(body.plan);
    if(!plan && service.template != 2){
        throw new errors.NotFoundError(`Тариф не найден`);
    }
    if(_.has(body, 'price') && service.template != 2 && plan.prices.includes(body.price)){
        throw new errors.ValidationError(`Не валидно поле price`, 'price');
    }
    let product = false;
    if(_.has(body, 'product')){
        product = await Products.findById(body.product);
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
                price: elem.price,
                count: el.count
            });
        })
    }

    let total = 0;
    const currency = await Utils.currencyById(body.price.currency);
    switch(service.template){
        case 0:
        case 1:
            const billing = +body.price.billing == 1 ? 12 : 1;
            if(_.has(body, 'members') && service.is_members){
                total += (+body.price.price * billing) * +body.members;
            }else{
                total += +body.price.price * billing;
            }
            if(options.length > 0){
                options.map(el => {
                    total += (el.price * el.count) * billing;
                })
            }
            break;
        case 2:
            total = body.total;
            break;
    }
    total = (total * currency).toFixed(2);

    if(total != body.total){
        throw new errors.ValidationError(`Неверная сумма! Ожидаемая: ${total}`, 'total');
    }
    
    let create = false, account = false;
    if(_.has(body, 'account') && _.has(body, 'account.login') && _.has(body, 'account.password')){
        if(body.account.password.length < 6){
            throw new errors.ValidationError(`Не валидно поле password`, 'account.password');
        }
        body.account.password = CryptoJS.AES.encrypt(body.account.password, config.passSecret).toString();
        create = body.account;
    }else{
        account = await UserAccount.findByUserAndService(ctx.state.user.id, service.id);
        if(!account){
            create = await Utils.generateEmailAccount(ctx.state.user);
        }
    }
    if(create && !account){
        account = await UserAccount.create({
            login: create.login,
            password: create.password,
            service: service.id,
            user: ctx.state.user.id
        });
        await Utils.createEmailAccount(account, ctx.state.user);
    }

    const ApiManagerInstance = new ApiManager({
        httpClient : new RequestHttpClient({
            request : Request
        }),
        terminalKey : config.payment.terminal,
        password : config.payment.password
    });

    const order = await Orders.create({
        service: service.id,
        product: product.id ?? null,
        plan: plan.id ?? null,
        price: body.price ?? null,
        options: options ?? null,
        members: body.members ?? null,
        total: total,
        user: ctx.state.user.id,
        user_account: account.id,
        status: 0,
        deleted: 0,
    });
    const dataPayment = await ApiManagerInstance.initPayment({
        OrderId: order.id,
        Amount: +order.total,
        PayType: PayType.SingleStage,
        CustomerKey: ctx.state.user.id
    });
    if(dataPayment.Success){
        await order.update({ pay_url: dataPayment.PaymentURL });
        ctx.body = {
            status: 'success',
            id: order.id,
            url: dataPayment.PaymentURL
        };
    }else{
        await Orders.destroy({ where: { id: order.id } });
        throw new errors.ForbiddenError(`Ошибка создания заказа, повторите попытку позднее`);
    }
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
    const order = await Orders.findById(ctx.params.id);
    if(!order){
        throw new errors.NotFoundError(`Заказ не найден`);
    }

    await Orders.destroy({ where: { id: order.id } });

    ctx.body = { status: 'success' };
};

/**
 * @api {get} /order Получение заказов
 * @apiGroup Orders
 */
const getAll = async (ctx) => {
    ctx.body = await Orders.getAllFront();
};

/**
 * @api {get} /order/:id Получение заказа
 * @apiGroup Orders
 */
const getOne = async (ctx) => {
    const order = await Orders.getOneFront(ctx.params.id);
    if(!order){
        throw new errors.NotFoundError(`Заказ не найден`);
    }
    ctx.body = order;
};


/**
 * @api {get} /order/status Изменение статуса заказа
 * @apiGroup Orders
 */
 const status = async (ctx) => {
    const body = ctx.request.body;
    if((_.has(body, 'OrderId') || _.has(body, 'TerminalKey') || _.has(body, 'Success') || _.has(body, 'Status')) && body.TerminalKey == config.payment.terminal && body.Success){
        const order = await Orders.getOneFront(body.OrderId);
        if(order){
            switch(body.Status){
                case 'CONFIRMED':
                    await order.update({ status: 1 });
                    break;
                case 'CANCELED':
                case 'AUTH_FAIL':
                case 'REJECTED':
                case 'REFUNDED':
                    await order.update({ status: 2 });
                    break;
            }
        }
    }
    ctx.body = 'OK';
};

/**
 * @api {get} /order/status Получение статусов заказов
 * @apiGroup Library
 */
 const statuses = async (ctx) => {
    ctx.body = Object.values(constants.order_status).map((item, i) => {
      return {
        id: i,
        name: item
      }
    })
  };

module.exports = {
  add,
  remove,
  getAll,
  getOne,
  status,
  statuses,
}
