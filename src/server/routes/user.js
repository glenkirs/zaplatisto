const Router = require('koa-router');
const user = require('../../controllers/user');

/**
 * Запросы для пользователей
 * Маршрут относительно /user
 */
const router = new Router();
router
    .put('/update', user.update)
    .del('/delete', user.deleteUser)
    .post('/auth', user.auth)
    .post('/sms', user.sms)
    .post('/sms/verify', user.smsVerify)
    .get('/info', user.info)
    .get('/all', user.getAll)
    .put('/role', user.roleSet)
    .get('/role', user.roleGet)
;

module.exports = router;