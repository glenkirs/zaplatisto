const Router = require('koa-router');
const iiko = require('../../controllers/iiko');

const router = new Router();

router
  .get('/iiko/organization/:id', iiko.getOrganization)
  .post('/iiko/update', iiko.updateSettings)
  .post('/auth/iiko/token', iiko.getToken)
;

module.exports = router;
