const logger = require('../../helpers/logger').getLogger();
const { popRequestState } = require('../../helpers/requestState');

const exclude = [
  '/tools',
];

const isExcludedPath = path => !exclude.every(e => !path.includes(e));

/**
 * Формируем объект с данными для индекса логов по идентификатору запроса и сессии
 * @param {Object} state - Служебные данные запроса, содержищие идентификаторы
 */
const getIds = state => ({ requestId: state.requestId, sessionId: state.sessionId });

/**
 * Логируем полученный запрос
 * @param {Object} ctx
 */
const logRequest = (ctx) => {
  const path = ctx.path;
  if (isExcludedPath(path)) {
    return false;
  }
  const message = {
    status: 'ok',
    data: 'Request recieved',
    remoteAddress: ctx.socket.remoteAddress,
    path,
    method: ctx.method,
    request: {
      state: ctx.state,
      body: ctx.request.body,
      params: ctx.query,
      headers: ctx.headers,
      timestamp: new Date(),
    },
  };

  return logger.trace(getIds(ctx.state), message);
};

/**
 * Высчитываем время выполнения запроса
 * @param {Object} ctx
 * @return {Number|null}
 */
const getElapsed = (ctx) => {
  if (!ctx.state.startHrtime) {
    return null;
  }

  const elapsed = process.hrtime(ctx.state.startHrtime);
  ctx.state.elapsed = Math.ceil((elapsed[0] * 1e3) + (elapsed[1] / 1e6));

  return ctx.state.elapsed;
};

/**
 * Логируем ответ на запрос
 * @param {Object} ctx
 */
const logResponse = (ctx) => {
  const path = ctx.path;
  if (isExcludedPath(path)) {
    return false;
  }
  let body;
  if (Array.isArray(ctx.body)) {
    body = `Array(${ctx.body.length})`;
  }
  const { state: { requestId } } = ctx;
  const message = {
    status: ctx.status,
    data: 'Response sent',
    elapsed: getElapsed(ctx),
    remoteAddress: ctx.socket.remoteAddress,
    path,
    method: ctx.method,
    response: {
      status: ctx.status,
      message: ctx.message,
      body: body || ctx.body,
      params: ctx.query,
      type: ctx.type,
      headers: ctx.response.headers,
      timestamp: new Date(),
      ...popRequestState(requestId),
    },
  };

  return logger.trace(getIds(ctx.state), message);
};

/**
 * Middleware для отправки лога запроса, желательно использовать после парсинга тела запроса
 * @param {Object} ctx
 * @param {Function} next
 * @return {Promise.<*>}
 */
const logRequestResponse = async (ctx, next) => {
  logRequest(ctx);

  return next();
};

const resolveAuthorizationHeader = (ctx, opts) => {
  if (!ctx.header || !ctx.header.authorization) {
    return null;
  }

  const parts = ctx.header.authorization.split(' ');

  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  if (!opts.passthrough) {
    ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"');
  }

  return null;
};

module.exports = {
  logRequest,
  logResponse,
  logRequestResponse,
  resolveAuthorizationHeader,
};
