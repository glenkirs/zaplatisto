const errors = require('ec-errors');
const logger = require('../../helpers/logger').getLogger();
const { logResponse } = require('./logRequestResponse');

const ErrorHandling = async (ctx, next) => {
  try {
    await next();
    if (ctx.body === undefined) {
      ctx.throw(new errors.BadRequestError('Unknown route or wrong request method'));
    }
  } catch (err) {
    [ctx.status, ctx.body] = errors.tools.parseError(err);
    logger.error(ctx.state, { message: 'Ошибка обработки запроса', err, errStack: err.stack });
  }
  logResponse(ctx);
};

module.exports = ErrorHandling;
