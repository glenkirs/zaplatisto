const Router = require('koa-router');
const user = require('../../controllers/user');

/**
 * Запросы для пользователей
 * Маршрут относительно /user
 */
const router = new Router();
router
    .post('/register', user.register)
    .put('/update', user.update)
    .del('/delete', user.deleteUser)
    .post('/auth', user.auth)
    .post('/sms', user.sms)
    .post('/sms/verify', user.smsVerify)
    .get('/info', user.info)
;

module.exports = router;