const Router = require('koa-router');
const user = require('./user');
const services = require('./services');
const config = require('../../config/sequelize');

const router = new Router();

router
  .use('/user', user.routes(), user.allowedMethods())
  .use('/services', services.routes(), services.allowedMethods())

  .get('/test', (ctx) => {
    ctx.body = config;
  })
;

module.exports = router;
