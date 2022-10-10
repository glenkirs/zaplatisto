const Router = require('koa-router');
const services = require('../../controllers/services');

/**
 * Запросы для пользователей
 * Маршрут относительно /services
 */
const router = new Router();
router
    .post('/add', services.add)
    .post('/edit', services.edit)
    .del('/remove', services.remove)
    .post('/upload', services.upload)
    .post('/plan/add', services.planAdd)
    .post('/plan/edit', services.planEdit)
    .del('/plan/remove', services.planRemove)
    .get('/', services.getAll)
    .get('/:id', services.getOne)
;

module.exports = router;