const errors = require('../../helpers/errors');
const logger = require('../../helpers/logger').getLogger();
const constants = require('../../helpers/constants');

const checkAction = ruleAction => (ruleAction === constants.actions.allow);
const checkPath = (rulePath, requestPath) => rulePath.test(requestPath);
const checkRole = (ruleRoles, requestRole) => (ruleRoles[0] === '*' || ruleRoles.indexOf(requestRole) !== -1);
const checkMethod = (ruleMethods, requestMethod) => (ruleMethods.indexOf(requestMethod) !== -1);

const testRbac = (rules, user, path, method, userAgent) => {
  for (let i = 0; i < rules.length; i += 1) {
    //logger.debug(checkPath(rules[i].path, path), checkMethod(rules[i].methods, method), checkRole(rules[i].roles, user.role), checkAction(rules[i].action));
    if (checkPath(rules[i].path, path)
      && checkMethod(rules[i].methods, method)
      && checkRole(rules[i].roles, user.role)
      && checkAction(rules[i].action)) {
      return true;
    }
  }

  throw new errors.ForbiddenError('Access denied');
};

const middleware = rules => async (ctx, next) => {
  try {
    //logger.debug('Check rbac', ctx.request.path);
    testRbac(rules, ctx.state.user, ctx.request.path, ctx.request.method, ctx.state.userAgent);
  } catch (err) {
    logger.error('server.middlewares.rbac', err.message);
    ctx.throw(err);
  }

  return next();
};


module.exports = middleware;
