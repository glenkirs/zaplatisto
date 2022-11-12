const Koa = require('koa');
const Http = require('http');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const { rules } = require('./routes/rbac-rules');
const config = require('../config');
const logger = require('../helpers/logger').getLogger();
const ErrorHandling = require('./middlewares/error-handling');
const RequestId = require('./middlewares/request-id');
const Rbac = require('./middlewares/rbac');
const jwt = require('jsonwebtoken');
const { logRequestResponse, resolveAuthorizationHeader } = require('./middlewares/logRequestResponse');
const path = require('path');
const serve = require('koa-static');
const mount = require('koa-mount');
const formidable = require('koa2-formidable');

const parseState = (ctx, next) => {
  try {
    const token = resolveAuthorizationHeader(ctx, ctx.headers.authorization);
    if (token) {
      ctx.state.user = jwt.verify(token, config.jwtSecret);
    } else {
      ctx.state.user = { role: 'guest' };
    }
    ctx.state.userAgent = ctx.headers.service;
  } catch (err) {
    logger.error({}, { message: 'server.index.parseState', err });
  }

  return next();
};

const start = () => new Promise((resolve, reject) => {
  const app = new Koa();

  app.use(serve(path.join(__dirname, '/../../doc')));
  app.use(mount('/static', serve(path.join(__dirname, '/../../static'))));
  app.use(RequestId);
  app.use(parseState);
  app.use(ErrorHandling);
  app.use(formidable());
  app.use(bodyParser({
    enableTypes: ['json', 'form']
  }));
  app.use(logRequestResponse);
  app.use(Rbac(rules));
  app.use(router.routes());

  const server = Http.createServer(app.callback()).listen(config.port, async (err) => {
    if (err) {
      logger.error({}, { message: `Service ${config.serviceName} not started` });

      return reject(err);
    }

    logger.info(`Service ${config.serviceName} started on *:${config.port}`);

    return resolve(server);
  });
});

module.exports = {
  start
}
