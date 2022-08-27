/* eslint-disable no-param-reassign, max-len */

const get = require('lodash.get');
const has = require('lodash.has');
const pick = require('lodash.pick');

/**
 * Статусы ошибок
 * @type {Object}
 */
const statuses = {
  BadRequestError: 400,
  UnauthorizedError: 401,
  ForbiddenError: 403,
  NotFoundError: 404,
  InternalServerError: 500,
  BadGatewayError: 502,
  GatewayTimeoutError: 504,
};

/**
 * Статусы и коды ошибок
 * @type {Object}
 */
const errors = {
  BadRequestError: { status: statuses.BadRequestError, code: 'BadRequestError' },
  ValidationError: { status: statuses.BadRequestError, code: 'ValidationError' },
  UnauthorizedError: { status: statuses.UnauthorizedError, code: 'UnauthorizedError' },
  ForbiddenError: { status: statuses.ForbiddenError, code: 'ForbiddenError' },
  NotFoundError: { status: statuses.NotFoundError, code: 'NotFoundError', message: 'Object not found' },
  InternalServerError: { status: statuses.InternalServerError, code: 'InternalServerError' },
  BadGatewayError: { status: statuses.BadGatewayError, code: 'BadGatewayError' },
  GatewayTimeoutError: { status: statuses.GatewayTimeoutError, code: 'GatewayTimeoutError' },
  PhoneConfirmError: { status: statuses.BadRequestError, code: 'PhoneConfirmError' },
  SMSError: { status: statuses.BadRequestError, code: 'SMSError' },
};

/**
 * ЗАмена парных ковычек одиночными
 * @param {String} text
 */
const normalizeMessage = text => (typeof text === 'string' || text instanceof String ? text.replace(/"/g, "'") : text);

/**
 * Базовый класс для ошибок
 */
class BaseError extends Error {
  constructor(...args) {
    super(...args);
    this.initData(errors.InternalServerError, args);
    Error.captureStackTrace(this, BaseError);
  }

  initData(error, args) {
    this.code = error.code;
    this.name = error.code;
    this.status = error.status;
    this.message = error.message; // Текст ошибки по умолчанию

    const message = args[0];  // Текст ошибки
    let details = args[1];    // Подробности ошибки

    if (typeof message === 'object') {                    // Если первый параметр объект
      details = message;                                  // Значит это подробности
    } else if (message && typeof message === 'string') {  // Иначе
      this.message = message;                             // Устанавливаем текст ошибки
    }

    if (details) {
      this.details = details;
      if (has(this.details, 'explain')) {
        this.explain = this.details.explain;            // Описание ошибки для вывода пользователю
      } else if (has(this.details, 'error.explain')) {
        this.explain = this.details.error.explain;      // Описание ошибки для вывода пользователю из проксируемой ошибки
      }
    }
  }

  humanizeStatus() {
    return this.status;
  }

  humanizeDetails() {
    const result = pick(this, ['code', 'explain', 'message']);

    if (process.env.NODE_ENV !== 'production') {
      result.details = this.details;
    }

    return result;
  }

  humanize() {
    return [
      this.humanizeStatus(),
      this.humanizeDetails(),
    ];
  }
}

/**
 * Некорректный запрос
 */
class BadRequestError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.BadRequestError, args);
    BaseError.captureStackTrace(this, BadRequestError);
  }
}

/**
 * Некорректные данные, ошибка валидации данных
 */
class ValidationError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.ValidationError, args);
    BaseError.captureStackTrace(this, ValidationError);
  }
}

/**
 * Ошибка валидации или отправки SMS
 */
class SMSError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.SMSError, args);
    BaseError.captureStackTrace(this, SMSError);
  }
}

/**
 * Некорректные подтверждения номера мобильного телефона
 */
class PhoneConfirmError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.PhoneConfirmError, args);
    BaseError.captureStackTrace(this, PhoneConfirmError);
  }
}

/**
 * Запрос не авторизован, токен отстутствует или не является корректными
 */
class UnauthorizedError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.UnauthorizedError, args);
    BaseError.captureStackTrace(this, UnauthorizedError);
  }
}

/**
 * Доступ запрещен
 */
class ForbiddenError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.ForbiddenError, args);
    BaseError.captureStackTrace(this, ForbiddenError);
  }
}

/**
 * Данные не найдены
 */
class NotFoundError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.NotFoundError, args);
    BaseError.captureStackTrace(this, NotFoundError);
  }
}

/**
 * Внутренняя ошибка сервера
 */
class InternalServerError extends BaseError {
  constructor(...args) {
    super(...args);
    BaseError.captureStackTrace(this, InternalServerError);
  }
}

/**
 * Ошибка удаленного сервера
 */
class BadGatewayError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.BadGatewayError, args);
    BaseError.captureStackTrace(this, BadGatewayError);
  }
}

/**
 * Ошибка соединения с удаленным сервером
 */
class GatewayTimeoutError extends BaseError {
  constructor(...args) {
    super(...args);
    this.initData(errors.GatewayTimeoutError, args);
    BaseError.captureStackTrace(this, GatewayTimeoutError);
  }
}

/**
 * Доступные ошибки
 * @type {Object}
 */
const Errors = {
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  BadGatewayError,
  GatewayTimeoutError,
  PhoneConfirmError,
  SMSError,
};

/**
 * Разбор ошибки от удаленного сервиса
 * @param err
 * @return {BaseError}
 */
const parseServiceError = (err) => {
  const error = err.error;
  switch (error.code) {
    case errors.BadRequestError.code:
      return new BadRequestError(error.message, error.details || err);
    case errors.ValidationError.code:
      return new ValidationError(error.message, error.details || err);
    case errors.UnauthorizedError.code:
      return new UnauthorizedError(error.message, error.details || err);
    case errors.ForbiddenError.code:
      return new ForbiddenError(error.message, error.details || err);
    case errors.NotFoundError.code:
      return new NotFoundError(error.message, error.details || err);
    case errors.BadGatewayError.code:
      return new BadGatewayError(error.message, error.details || err);
    case errors.GatewayTimeoutError.code:
      return new GatewayTimeoutError(error.message, error.details || err);
    default:
      return new BaseError(error.message, error.details || err);
  }
};

/**
 * Подготовка объекта details, содержащего ошибки и описание первой ошибки для перевода, если оно есть
 * @param err
 * @return {Object}
 */
const getDetails = (err) => {
  const details = {
    errors: get(err, 'errors'), // Добавляем ошибки sequelize
  };

  // Если есть описание ошибки для перевода на фронте, добавляем его
  const explain = get(err, 'errors[0].__raw.explain');
  if (explain) {
    details.explain = explain;
  }

  return details;
};

/**
 * Приведение разных ошибок к стандарту
 * @param {Object} err
 * @return {Object}
 */
const transformError = (err) => {
  if (err instanceof BaseError) {
    return err;
  }

  let error;

  if (err.status === 401) {
    return new UnauthorizedError(normalizeMessage(err.message), err);
  }
  // if (err.statusCode === 403) {
  //   return new ForbiddenError(normalizeMessage(err.message), err);
  // }

  switch (err.constructor.name) {
    // Ошибки соединения с удаленным сервером (модуль request)
    case 'RequestError': {
      if (has(err, 'cause.code')) {
        switch (err.cause.code) {
          case 'EAI_AGAIN': {
            error = new BadGatewayError('Temporary failure in name resolution occurred', err);
            break;
          }
          case 'ENOTFOUND': {
            error = new BadGatewayError('Remote host is not found', err);
            break;
          }
          case 'EHOSTUNREACH': {
            error = new BadGatewayError('Remote host is unreachable', err);
            break;
          }
          case 'ECONNREFUSED': {
            error = new BadGatewayError('Remote host connection is not refused', err);
            break;
          }
          case 'ECONNRESET': {
            error = new BadGatewayError('Remote host is not answered', err);
            break;
          }
          case 'EPIPE': {
            error = new BadGatewayError('Write to pipe error', err);
            break;
          }
          case 'ESOCKETTIMEDOUT': {
            error = new GatewayTimeoutError('Socket read is timed out', err);
            break;
          }
          case 'ETIMEDOUT': {
            error = new GatewayTimeoutError('Connection is timed out', err);
            break;
          }
          default: {
            error = new BaseError('RequestError', err);
          }
        }
      }
      break;
    }
    // Ошибки Sequelize
    case 'ValidationError':
    case 'ForeignKeyConstraintError': {
      error = new ValidationError(normalizeMessage(err.message), getDetails(err));
      break;
    }
    case 'UniqueConstraintError': {
      try {
        error = new ValidationError(normalizeMessage(err.errors[0].message), getDetails(err));
      } catch (e) {
        error = new ValidationError(normalizeMessage(err.message), getDetails(err));
      }

      break;
    }
    case 'DatabaseError': {
      if (has(err, 'parent.code') && err.parent.code === 'ECONNRESET') {
        error = new InternalServerError(normalizeMessage(err.message), getDetails(err));
      } else {
        error = new ValidationError(normalizeMessage(err.message), getDetails(err));
      }
      break;
    }
    // Ошибки от удаленного сервиса
    case 'StatusCodeError': {
      error = parseServiceError(err);
      break;
    }
    default: {
      error = new BaseError(normalizeMessage(err.message), err);
    }
  }

  return error;
};

/**
 * Приведение ошибки к человекочитаемому виду
 * @param err
 */
const parseError = err => transformError(err).humanize();

module.exports = Errors;

module.exports.tools = {
  parseError,
  transformError,
};
