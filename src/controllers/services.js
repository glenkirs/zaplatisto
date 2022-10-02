const errors = require('../helpers/errors');
const models = require('../sequelize/models');
const { isArray } = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const logger = require('../helpers/logger').getLogger();
const { _ } = require('lodash');

const Services = models.services;
const Plans = models.plans;

/**
 * @api {post} /services/add Добавление сервиса
 * @apiGroup Services
 * @apiBody {String} [name] Название сервиса
 * @apiBody {String} [img] Изображение сервиса (необязательно)
 * @apiBody {String} [label] Лейбл сервиса (необязательно)
 * @apiBody {Json} [plans] Тарифы (необязательно)
 * @apiBody {String} [plans][title] Название
 * @apiBody {String} [plans][sub_title] Дополнительное название (необязательно)
 * @apiBody {Number} [plans][price] Цена
 * @apiBody {Number} [plans][billing] Сезонность платежа (0 - Месяц / 1 - Год)
 * @apiBody {Json} [plans][descriptions] Массив описаний
 */
const add = async (ctx) => {
    const body = ctx.request.body;
    if(!body.name || (body.name && body.name.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле name`);
    }
    const service = await Services.create({
        name: body.name,
        img: body.img ?? null,
        label: body.label ?? null,
    })
    if(body.plans && body.plans.length > 0 && isArray(body.plans)){
        body.plans.forEach(async (e, i) => {
            await Plans.create({
                title: e.title,
                sub_title: e.sub_title ?? null,
                price: e.price,
                billing: e.billing,
                service: service.id,
                descriptions: e.descriptions ?? null,
            })
        })
    }
    ctx.body = {create: 'true'};
};

/**
 * @api {post} /services/edit Редактирование сервиса
 * @apiGroup Services
 * @apiBody {Number} [id] ID сервиса
 * @apiBody {String} [name] Название сервиса
 * @apiBody {String} [img] Изображение сервиса (необязательно)
 * @apiBody {String} [label] Лейбл сервиса (необязательно)
 * @apiBody {Json} [plans] Тарифы (необязательно)
 * @apiBody {String} [plans][id] ID тарифа
 * @apiBody {String} [plans][title] Название
 * @apiBody {String} [plans][sub_title] Дополнительное название (необязательно)
 * @apiBody {Number} [plans][price] Цена
 * @apiBody {Number} [plans][billing] Сезонность платежа (0 - Месяц / 1 - Год)
 * @apiBody {Json} [plans][descriptions] Массив описаний
 */
const edit = async (ctx) => {
    const body = ctx.request.body;
    if(!body.name || (body.name && body.name.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле name`);
    }
    if(!body.id){
        throw new errors.ValidationError(`Не найдено поле ID`);
    }
    const service = await Services.findById(body.id);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    await Services.update(
        {
            name: body.name,
            img: body.img ?? null,
            label: body.label ?? null,
        },
        { where: { id: service.id } }
    )
    if(body.plans && body.plans.length > 0 && isArray(body.plans)){
        body.plans.forEach(async (e, i) => {
            if(e.id){
                await Plans.update({
                    title: e.title,
                    sub_title: e.sub_title ?? null,
                    price: e.price,
                    billing: e.billing,
                    descriptions: e.descriptions ?? null,
                },
                { where: { id: e.id } })
            }
        })
    }
    ctx.body = {update: 'true'};
};

/**
 * @api {delete} /services/remove Удаление сервиса
 * @apiGroup Services
 * @apiBody {Number} [id] ID сервиса
 */
const remove = async (ctx) => {
    const body = ctx.request.body;
    if(!body.id){
        throw new errors.ValidationError(`Не найдено поле ID`);
    }
    const service = await Services.findById(body.id);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    await Services.destroy({ where: { id: service.id } });
    await Plans.destroy({ where: { service: service.id } })
    ctx.body = {delete: 'true'};
};

/**
 * @api {post} /services/upload Загрузка изображения сервиса
 * @apiGroup Services
 * @apiBody {File} [file] Файл изображения
 */
const upload = async (ctx) => {
    return new Promise(function(resolve, reject) {
        const form = new formidable.IncomingForm();
        form.parse(ctx.req, (error, fields, file) => {
            if(file.file){
                const filepath = file.file.filepath;
                const newpath = `${path.resolve(__dirname, '../../static')}/${file.file.originalFilename}`;
                fs.rename(filepath, newpath, () => {
                    ctx.body = {path: newpath};
                    resolve();
                });
            }else{
                ctx.body = {
                    status: "Error",
                    file: "NotFound"
                };
                resolve();
            }
        });
    });
};

/**
 * @api {post} /services/plan/add Добавление тарифа
 * @apiGroup Services
 * @apiBody {Number} [service] Сервис
 * @apiBody {String} [title] Название
 * @apiBody {String} [sub_title] Дополнительное название (необязательно)
 * @apiBody {Number} [price] Цена
 * @apiBody {Number} [billing] Сезонность платежа (0 - Месяц / 1 - Год)
 * @apiBody {Json} [descriptions] Массив описаний
 */
const planAdd = async (ctx) => {
    const body = ctx.request.body;
    if(!body.service){
        throw new errors.ValidationError(`Не найдено поле service`);
    }
    if(!body.title || (body.title && body.title.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле title`);
    }
    if(!body.price){
        throw new errors.ValidationError(`Не найдено поле price`);
    }
    if(!_.has(body, 'billing')){
        throw new errors.ValidationError(`Не найдено поле billing`);
    }
    if(!body.descriptions || (body.descriptions && !isArray(body.descriptions))){
        throw new errors.ValidationError(`Не найдено или не валидно поле descriptions`);
    }

    const service = await Services.findById(body.service);
    if(!service){
        throw new errors.NotFoundError(`Сервис не найден`);
    }
    await Plans.create({
        title: body.title,
        sub_title: body.sub_title ?? null,
        price: body.price,
        billing: body.billing,
        service: service.id,
        descriptions: body.descriptions ?? null,
    })
    ctx.body = {create: 'true'};
};

/**
 * @api {post} /services/plan/edit Редактирование тарифа
 * @apiGroup Services
 * @apiBody {Number} [id] ID тарифа
 * @apiBody {String} [title] Название
 * @apiBody {String} [sub_title] Дополнительное название (необязательно)
 * @apiBody {Number} [price] Цена
 * @apiBody {Number} [billing] Сезонность платежа (0 - Месяц / 1 - Год)
 * @apiBody {Json} [descriptions] Массив описаний
 */
 const planEdit = async (ctx) => {
    const body = ctx.request.body;
    if(!body.id){
        throw new errors.ValidationError(`Не найдено поле id`);
    }
    if(!body.title || (body.title && body.title.length < 4)){
        throw new errors.ValidationError(`Не найдено или не валидно поле title`);
    }
    if(!body.price){
        throw new errors.ValidationError(`Не найдено поле price`);
    }
    if(!_.has(body, 'billing')){
        throw new errors.ValidationError(`Не найдено поле billing`);
    }
    if(!body.descriptions || (body.descriptions && !isArray(body.descriptions))){
        throw new errors.ValidationError(`Не найдено или не валидно поле descriptions`);
    }

    const plan = await Plans.findById(body.id);
    if(!plan){
        throw new errors.NotFoundError(`Тариф не найден`);
    }
    await Plans.update({
        title: body.title,
        sub_title: body.sub_title ?? null,
        price: body.price,
        billing: body.billing,
        descriptions: body.descriptions ?? null,
    },{ where: { id: plan.id } })
    ctx.body = {update: 'true'};
};

/**
 * @api {delete} /services/plan/remove Удаление тарифа
 * @apiGroup Services
 * @apiBody {Number} [id] ID тарифа
 */
const planRemove = async (ctx) => {
    const body = ctx.request.body;
    if(!_.has(body, 'id')){
        throw new errors.ValidationError(`Не найдено поле ID`);
    }
    const plan = await Plans.findById(body.id);
    if(!plan){
        throw new errors.NotFoundError(`Тариф не найден`);
    }
    await Plans.destroy({ where: { id: plan.id } })
    ctx.body = {delete: 'true'};
};

/**
 * @api {post} /services Получение сервисов
 * @apiGroup Services
 * @apiBody {String} [phone] Телефон в формате 79992223344
 */
const getAll = async (ctx) => {
    ctx.body = await Services.getAllFront();
};

/**
 * @api {post} /services/:id Получение сервиса
 * @apiGroup Services
 * @apiBody {String} [phone] Телефон в формате 79992223344
 */
const getOne = async (ctx) => {
    ctx.body = await Services.getOneFront(ctx.params.id);
};

module.exports = {
  add,
  edit,
  remove,
  upload,
  planAdd,
  planEdit,
  planRemove,
  getAll,
  getOne,
}
