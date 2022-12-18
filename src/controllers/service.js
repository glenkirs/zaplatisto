const errors = require('../helpers/errors');
const models = require('../sequelize/models');
const logger = require('../helpers/logger').getLogger();
const constants = require('../helpers/constants');
const { _ } = require('lodash');
const Utils = require('../helpers/utils');

const Services = models.services;
const Plans = models.plans;
const Products = models.products;

/**
 * @api {post} /service Добавление сервиса
 * @apiGroup Services
 * @apiBody {String} [name] Название сервиса
 * @apiBody {File} [img] Изображение сервиса
 * @apiBody {Number} [template] Шаблон сервиса
 * @apiBody {Boolean} [is_active] Активность сервиса
 * @apiSuccess (200) {String} status Успешное добавление
 * @apiSuccess (200) {String} service ID добавленного сервиса
 */
const add = async (ctx) => {
    const { body, files } = ctx.request;
    if(!_.has(body, 'name') || (_.has(body, 'name') && body.name.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле name`, 'name');
    }
    if(!_.has(body, 'template') || (_.has(body, 'template') && !Object.keys(constants.template).includes(body.template))){
        throw new errors.ValidationError(`Не найдено или не валидно поле template`, 'template');
    }
    if(!_.has(body, 'is_active')){
        throw new errors.ValidationError(`Не найдено поле is_active`, 'is_active');
    }
    if(!_.has(files, 'img')){
        throw new errors.ValidationError(`Не найден файл img`, 'img');
    }
    const pathImg = await Utils.uploadFile(files.img, { width: 100, height: 35 });

    const service = await Services.create({
        name: body.name,
        img: pathImg,
        template: body.template ?? 0,
        is_active: body.is_active || false,
    });
    ctx.body = {
        status: 'success',
        id: service.id
    };
};

/**
 * @api {put} /services/:id Редактирование сервиса
 * @apiGroup Services
 * @apiBody {Number} [id] ID сервиса
 * @apiBody {String} [name] Название сервиса
 * @apiBody {String} [img] Изображение сервиса
 * @apiBody {Number} [template] Шаблон сервиса
 * @apiBody {Boolean} [is_active] Активность сервиса
 * @apiSuccess (200) {String} status Успешное редактирование
 */
const edit = async (ctx) => {
    const { body, files } = ctx.request;
    if(!_.has(ctx.params, 'id')){
        throw new errors.ValidationError(`Не найдено поле ID`, 'id');
    }
    if(!_.has(body, 'name') || (_.has(body, 'name') && body.name.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле name`, 'name');
    }
    if(!_.has(body, 'template') || (_.has(body, 'template') && !Object.keys(constants.template).includes(body.template))){
        throw new errors.ValidationError(`Не найдено или не валидно поле template`, 'template');
    }
    if(!_.has(body, 'is_active')){
        throw new errors.ValidationError(`Не найдено поле is_active`, 'is_active');
    }

    const service = await Services.findById(ctx.params.id);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    let pathImg = service.img;
    if(_.has(files, 'img') && !_.isString(pathImg)){
        pathImg = await Utils.uploadFile(files.img, { width: 100, height: 35 });
    }
    await Services.update(
        {
            name: body.name,
            img: pathImg,
            template: body.template ?? 0,
            is_active: body.is_active ?? null,
        },
        { where: { id: service.id } }
    )

    ctx.body = { status: 'success' };
};

/**
 * @api {delete} /service/:id Удаление сервиса
 * @apiGroup Services
 * @apiBody {Number} [id] ID сервиса
 * @apiSuccess (200) {String} status Успешное удаление
 */
const remove = async (ctx) => {
    if(!_.has(ctx.params, 'id')){
        throw new errors.ValidationError(`Не найдено поле ID`, 'id');
    }
    const service = await Services.findById(ctx.params.id);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }

    await Utils.deleteFile(`.${service.img}`);
    const products = await Products.findByService(service.id);
    if(products){
        products.forEach(async p => {
            if(p.logo32){
                await Utils.deleteFile(`.${p.logo32}`);
            }
            if(p.logo24){
                await Utils.deleteFile(`.${p.logo24}`);
            }
        })
    }
    await Products.destroy({ where: { service: service.id } });
    await Plans.destroy({ where: { service: service.id } });
    await Services.destroy({ where: { id: service.id } });

    ctx.body = { status: 'success' };
};

/**
 * @api {get} /service Получение сервисов
 * @apiQuery {Number} [template] ID шаблона, фильтрация по шаблонам
 * @apiQuery {Number} [is_active] 1/0 true/false фильтрация по активности сервисов
 * @apiQuery {Number} [products.is_active] 1/0 true/false фильтрация по активности продуктов
 * @apiQuery {Number} [plans.is_active] 1/0 true/false фильтрация по активности тарифов
 * @apiQuery {Number} [plans.plans_options.is_active] 1/0 true/false фильтрация по активности опций тарифов
 * @apiGroup Services
 */
const getAll = async (ctx) => {
    ctx.body = await Services.getAllFront(ctx);
};

/**
 * @api {get} /service/:id Получение сервиса
 * @apiGroup Services
 */
const getOne = async (ctx) => {
    const service = await Services.getOneFront(ctx.params.id);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    ctx.body = service;
};

module.exports = {
  add,
  edit,
  remove,
  getAll,
  getOne,
}
