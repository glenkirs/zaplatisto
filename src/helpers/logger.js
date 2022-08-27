const _ = require('lodash');
const log4js = require('log4js');
const stringify = require('fast-safe-stringify');
const config = require('../config');

/**
 * Обертка для логгера, начинает обработку лога в следующем цикле событий
 */
class Logger {
  constructor(...args) {
    this.logger = log4js.getLogger(...args);
  }

  /**
   * Запускаем функцию callback в следующем цикле
   * @param {Function} callback
   */
  static callLogMethod(callback) {
    process.nextTick(callback);
  }

  trace(...args) {
    this.constructor.callLogMethod(() => this.logger.trace(...args));
  }
  debug(...args) {
    this.constructor.callLogMethod(() => this.logger.debug(...args));
  }
  info(...args) {
    this.constructor.callLogMethod(() => this.logger.info(...args));
  }
  warn(...args) {
    this.constructor.callLogMethod(() => this.logger.warn(...args));
  }
  error(...args) {
    this.constructor.callLogMethod(() => this.logger.error(...args));
  }
  fatal(...args) {
    this.constructor.callLogMethod(() => this.logger.fatal(...args));
  }
  async elapsed(f, jobId, state) {
    const start = process.hrtime();
    const result = await f();
    const delta = process.hrtime(start);
    const elapsed = Math.ceil((delta[0] * 1e3) + (delta[1] / 1e6));
    this.warn({ ...state, jobId, elapsed });

    return result;
  }

  static getLogger(...args) {
    return new Logger(...args);
  }
}

/**
 * Поиск значения ключа в элементах массива data
 * @param {Array<Object>} data
 * @param {String} key
 * @param {String|any} defaultValue
 */
const getKey = (data, key, defaultValue = null) => {
  const withKeyObj = data.find(d => d && d[key]);

  return _.get(withKeyObj, key, defaultValue);
};

const getErrorField = (data, field) => {
  const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
  let value = _.get(data, `[1].err.${field}`);
  if (value) {
    _.set(data, `[1].err${capitalizedField}`, value);
  } else {
    value = _.get(data, `[0].err.${field}`);
    if (value) {
      _.set(data, `[0].err${capitalizedField}`, value);
    }
  }
};


/**
 * Обработка данных для лога, формирование полей для индекса
 * @param configuration
 * @param logEvent
 * @return {string}
 */
const handleLog = (configuration, logEvent) => {
  let jobId = null;
  let elapsed = null;
  let requestId = null;
  let sessionId = null;
  let sqlDuration = null;
  let requestMethod = null;
  let requestPath = null;

  const logLevel = _.get(logEvent, 'level.levelStr', null);
  const data = _.get(logEvent, 'data', null);

  if (Array.isArray(data)) {
    if (data.length > 1 && data[0]) {
      const ids = data.shift();
      requestId = ids.requestId;
      sessionId = ids.sessionId;
    } else {
      requestId = getKey(data, 'requestId');
      sessionId = getKey(data, 'sessionId');
    }
    jobId = getKey(data, 'jobId');
    elapsed = getKey(data, 'elapsed');
    requestPath = getKey(data, 'path');
    requestMethod = getKey(data, 'method');
    sqlDuration = getKey(data, 'sqlDuration');

    getErrorField(data, 'stack');
    getErrorField(data, 'details');
    getErrorField(data, 'message');
  }
  const payloadString = stringify(data);
  const logObj = {
    service: config.serviceName,
    logLevel,
    requestId,
    sessionId,
    payloadString,
    createdAt: _.get(logEvent, 'startTime', null),
  };

  if (jobId) {
    logObj.jobId = jobId;
  }

  if (elapsed) {
    logObj.elapsed = elapsed;
  }

  if (requestPath) {
    logObj.requestPath = requestPath;
  }

  if (requestMethod) {
    logObj.requestMethod = requestMethod;
  }

  if (sqlDuration) {
    logObj.sqlDuration = sqlDuration;
  }

  return stringify(logObj) + configuration.separator;
};

/**
 * Настройка логгера
 */
const initLog4js = () => {
  const defaultAppender = config.environment === 'production' ? 'out' : 'dev';

  log4js.addLayout('json', configuration => logEvent => handleLog(configuration, logEvent));
  log4js.configure({
    appenders: {
      dev: { type: 'stdout' },
      out: { type: 'stdout', layout: { type: 'json', separator: ',' } },
    },

    /**
     * Доступные значения level: ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF
     */
    categories: { default: { appenders: [defaultAppender], level: 'all' } },
  });
};

initLog4js();

/**
 * method list. see http://stritti.github.io/log4js/apidocs/index.html
 */
const logMethods = ['debug', 'error', 'fatal', 'info', 'trace', 'warn'];

const getLogger = (...args) => Logger.getLogger(...args);

module.exports = {
  getLogger,
  logMethods,
}
