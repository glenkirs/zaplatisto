const Router = require('koa-router');
const config = require('../../config/sequelize');
const user = require('../../controllers/user');
const userAccounts = require('../../controllers/userAccounts');
const service = require('../../controllers/service');
const product = require('../../controllers/product');
const plan = require('../../controllers/plan');
const planOptions = require('../../controllers/planOptions');
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
  //Users accounts
  .get('/user/accounts', userAccounts.getAll)
  .get('/user/accounts/:id', userAccounts.info)
  .get('/user/accounts/:id/password', userAccounts.decryptPass)
  .put('/user/accounts/:id', userAccounts.update)
  .del('/user/accounts/:id', userAccounts.deleteAccount)

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

  //Plan Options
  .get('/plan/options', planOptions.getAll)
  .post('/plan/options', planOptions.add)
  .get('/plan/options/:id', planOptions.getOne)
  .put('/plan/options/:id', planOptions.edit)
  .del('/plan/options/:id', planOptions.remove)

  //Plan
  .get('/plan', plan.getAll)
  .post('/plan', plan.add)
  .get('/plan/:id', plan.getOne)
  .put('/plan/:id', plan.edit)
  .del('/plan/:id', plan.remove)

  //Currency
  .get('/currency', library.getCurrency)
  .get('/currency/calc', library.getCurrencyCalc)

  //Billing
  .get('/billing', library.getBilling)

  //Template
  .get('/template', library.getTemplate)

  //Role
  .get('/role', library.getRole)

  //Order
  .get('/order/statuses', order.statuses)
  .get('/order', order.getAll)
  .post('/order', order.add)
  .get('/order/:id', order.getOne)
  .del('/order/:id', order.remove)
  .post('/order/status', order.status)
;

module.exports = router;
