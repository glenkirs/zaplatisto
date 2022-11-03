const Router = require('koa-router');
const config = require('../../config/sequelize');
const user = require('../../controllers/user');
const service = require('../../controllers/service');
const product = require('../../controllers/product');
const plan = require('../../controllers/plan');
const library = require('../../controllers/library');
const order = require('../../controllers/order');

const router = new Router();

router
  //Users
  .get('/user', user.info)
  .get('/user/list', user.getAll)
  .post('/user/auth', user.auth)
  .post('/user/sms', user.sms)
  .post('/user/sms/verify', user.smsVerify)
  .get('/user/:id', user.infoById)
  .put('/user/:id', user.update)
  .del('/user/:id', user.deleteUser)

  //Service
  .get('/service', service.getAll)
  .post('/service', service.add)
  .get('/service/:id', service.getOne)
  .put('/service/:id', service.edit)
  .del('/service/:id', service.remove)

  //Product
  .get('/product', product.getAll)
  .post('/product', product.add)
  .get('/product/:id', product.getOne)
  .put('/product/:id', product.edit)
  .del('/product/:id', product.remove)

  //Plan
  .get('/plan', plan.getAll)
  .post('/plan', plan.add)
  .get('/plan/:id', plan.getOne)
  .put('/plan/:id', plan.edit)
  .del('/plan/:id', plan.remove)

  //Currency
  .get('/currency', library.getCurrency)

  //Billing
  .get('/billing', library.getBilling)

  //Template
  .get('/template', library.getTemplate)

  //Role
  .get('/role', library.getRole)

  //Plan
  .get('/order', order.getAll)
  .post('/order', order.add)
  .get('/order/:id', order.getOne)
  .put('/order/:id', order.edit)
  .del('/order/:id', order.remove)
;

module.exports = router;
