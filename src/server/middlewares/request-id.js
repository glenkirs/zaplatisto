const logger = require('../../helpers/logger');
const random = require('../../helpers/random');

const key = 'X-Request-Id';

const requestId = async (ctx, next) => {
  try {
    ctx.state.requestId = ctx.id || ctx.query[key] || ctx.get(key) || await random.requestId();
    ctx.state.sessionId = ctx.get('X-Session-Id') || null;
    ctx.append(key, ctx.state.requestId);

    // Сохраняем время начала запроса, используется в логе ответа
    ctx.state.startHrtime = process.hrtime();
  } catch (err) {
    logger.error(ctx.state, { message: 'middlewares.requestId', err });
  }

  return next();
};

module.exports = requestId;
