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
 * @api {post} /product Добавление продукта
 * @apiGroup Products
 * @apiBody {String} [title] Название продукта
 * @apiBody {File} [logo32] Лого в формате 32х32
 * @apiBody {File} [logo24] Лого в формате 24х24
 * @apiBody {Number} [service] ID сервиса
 * @apiBody {Boolean} [is_active] Активность продукта
 * @apiSuccess (200) {String} status Успешное добавление
 * @apiSuccess (200) {String} id ID добавленного продукта
 */
const add = async (ctx) => {
    const { body, files } = ctx.request;
    if(!_.has(body, 'title') || (_.has(body, 'title') && body.title.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле title`, 'title');
    }
    if(!_.has(files, 'logo32')){
        throw new errors.ValidationError(`Не найден файл logo32`, 'logo32');
    }
    if(!_.has(files, 'logo24')){
        throw new errors.ValidationError(`Не найден файл logo24`, 'logo24');
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

    const pathImg32 = await Utils.uploadFile(files.logo32, { width: 32, height: 32 });
    const pathImg24 = await Utils.uploadFile(files.logo24, { width: 24, height: 24 });

    const product = await Products.create({
        title: body.title,
        logo32: pathImg32,
        logo24: pathImg24,
        service: service.id,
        is_active: body.is_active ?? null,
    });
    ctx.body = {
        status: 'success',
        id: product.id
    };
};

/**
 * @api {put} /product/:id Редактирование продукта
 * @apiGroup Products
 * @apiBody {Number} [id] ID продукта
 * @apiBody {String} [title] Название продукта
 * @apiBody {File} [logo32] Лого в формате 32х32
 * @apiBody {File} [logo24] Лого в формате 24х24
 * @apiBody {Number} [service] ID сервиса
 * @apiBody {Boolean} [is_active] Активность продукта
 * @apiSuccess (200) {String} status Успешное редактирование
 */
const edit = async (ctx) => {
    const { body, files } = ctx.request;
    if(!_.has(body, 'title') || (_.has(body, 'title') && body.title.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле title`, 'title');
    }
    if(!_.has(body, 'service')){
        throw new errors.ValidationError(`Не найдено поле service`, 'service');
    }
    if(!_.has(body, 'is_active')){
        throw new errors.ValidationError(`Не найдено поле is_active`, 'is_active');
    }

    const product = await Products.findById(ctx.params.id);
    if(!product){
        throw new errors.NotFoundError(`Продукт не найден`);
    }
    const service = await Services.findById(body.service);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }

    let pathImg32 = product.logo32;
    let pathImg24 = product.logo24;
    if(_.has(files, 'logo32')){
        pathImg32 = await Utils.uploadFile(files.logo32);
    }
    if(_.has(files, 'logo24')){
        pathImg24 = await Utils.uploadFile(files.logo24);
    }

    await Products.update(
        {
            title: body.title,
            logo32: pathImg32,
            logo24: pathImg24,
            service: service.id,
            is_active: body.is_active ?? null,
        },
        { where: { id: product.id } }
    )

    ctx.body = { status: 'success' };
};

/**
 * @api {delete} /product/:id Удаление продукта
 * @apiGroup Products
 * @apiBody {Number} [id] ID продукта
 * @apiSuccess (200) {String} status Успешное удаление
 */
const remove = async (ctx) => {
    if(!_.has(ctx.params, 'id')){
        throw new errors.ValidationError(`Не найдено поле ID`, 'id');
    }
    const product = await Products.findById(ctx.params.id);
    if(!product){
        throw new errors.NotFoundError(`Продукт не найден`);
    }

    if(product.logo32){
        await Utils.deleteFile(`.${product.logo32}`);
    }
    if(product.logo24){
        await Utils.deleteFile(`.${product.logo24}`);
    }
    await Products.destroy({ where: { id: product.id } });

    ctx.body = { status: 'success' };
};

/**
 * @api {get} /product Получение продуктов
 * @apiGroup Products
 */
const getAll = async (ctx) => {
    ctx.body = await Products.getAllFront();
};

/**
 * @api {get} /product/:id Получение продукта
 * @apiGroup Products
 */
const getOne = async (ctx) => {
    const product = await Products.getOneFront(ctx.params.id);
    if(!product){
        throw new errors.NotFoundError(`Продукт не найден`);
    }
    ctx.body = product;
};

module.exports = {
  add,
  edit,
  remove,
  getAll,
  getOne,
}
