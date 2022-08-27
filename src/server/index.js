const Koa = require('koa');
const Http = require('http');
const bodyParser = require('koa-bodyparser');
const constants = require('ec-constants');
const router = require('./routes');
const config = require('../config');
const ErrorHandling = require('./middlewares/error-handling');
const { init } = require('../logic/iiko');
const logger = require('../helpers/logger').getLogger();
const RequestId = require('./middlewares/request-id');
const { logRequestResponse } = require('./middlewares/logRequestResponse');

const { managerRoles } = constants.roles;

const allMarketsRoles = [
  managerRoles.supportLead,
  managerRoles.supportGroupLead,
  managerRoles.support,
  managerRoles.clientLead,
  managerRoles.clientFirstLine,
];

const parseState = (ctx, next) => {
  try {
    if (ctx.headers.user) {
      ctx.state.user = JSON.parse(ctx.headers.user);
      if (allMarketsRoles.includes(ctx.state.user.role) && !ctx.state.user.marketId) {
        const marketId = _.get(ctx, 'query.marketId');
        if (marketId) ctx.state.user.marketId = marketId;
      }
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

  app.use(RequestId);
  app.use(parseState);
  app.use(ErrorHandling);
  app.use(bodyParser());
  app.use(logRequestResponse);
  app.use(router.routes());

  const server = Http.createServer(app.callback()).listen(config.port, async (err) => {
    if (err) {
      logger.error({}, { message: `Service ${config.serviceName} not started` });

      return reject(err);
    }

    logger.info(`Service ${config.serviceName} started on *:${config.port}`);
    await init();

    return resolve(server);
  });
});

module.exports = {
  start
}
