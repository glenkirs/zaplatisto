const Router = require('koa-router');
const token = require('../../controllers/token');

const router = new Router();

router
  .get('/auth/token', token.generateToken)
;

module.exports = router;
