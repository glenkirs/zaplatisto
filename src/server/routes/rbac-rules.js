/* eslint-disable no-param-reassign, max-len */
const { _ } = require('lodash');
const constants = require('../../helpers/constants');

const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const imgId = '.+.[png,jpg]+';
const intId = '[0-9]+';
const mobilePhone = '[0-9]{11,20}';
const r = constants.roles;
const actions = constants.actions;

const excludeRoles = (roles, toExclude) => {
  const roleValues = _.values(roles);
  return _.pullAll(roleValues, _.isArray(toExclude) ? toExclude : [toExclude]);
};

const rules = [
  //Static
  { path: '^/doc', roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: `^/static/${imgId}`, roles: ['*'], methods: ['GET'], action: actions.allow },

  //Users
  { path: '^/user', roles: [r.user, r.admin], methods: ['GET'], action: actions.allow },
  { path: '^/user/list', roles: [r.admin], methods: ['GET'], action: actions.allow },
  { path: '^/user/auth', roles: ['*'], methods: ['POST'], action: actions.allow },
  { path: '^/user/sms', roles: ['*'], methods: ['POST'], action: actions.allow },
  { path: `^/user/${intId}`, roles: [r.user, r.admin], methods: ['GET', 'PUT', 'DELETE'], action: actions.allow },
  { path: '^/user/accounts', roles: [r.admin], methods: ['GET'], action: actions.allow },
  { path: `^/user/accounts/${intId}`, roles: [r.user, r.admin], methods: ['GET'], action: actions.allow },
  { path: `^/user/accounts/${intId}`, roles: [r.admin], methods: ['PUT', 'DELETE'], action: actions.allow },

  //Service
  { path: '^/service', roles: [r.admin], methods: ['POST', 'PUT', 'DELETE'], action: actions.allow },
  { path: '^/service', roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: `^/service/${intId}`, roles: ['*'], methods: ['GET'], action: actions.allow },

  //Product
  { path: '^/product', roles: [r.admin], methods: ['POST', 'PUT', 'DELETE'], action: actions.allow },
  { path: '^/product', roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: `^/product/${intId}`, roles: ['*'], methods: ['GET'], action: actions.allow },

  //Plan Options
  { path: '^/plan/options', roles: [r.admin], methods: ['POST', 'PUT', 'DELETE'], action: actions.allow },
  { path: '^/plan/options', roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: `^/plan/options/${intId}`, roles: ['*'], methods: ['GET'], action: actions.allow },

  //Plan
  { path: '^/plan', roles: [r.admin], methods: ['POST', 'PUT', 'DELETE'], action: actions.allow },
  { path: '^/plan', roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: `^/plan/${intId}`, roles: ['*'], methods: ['GET'], action: actions.allow },

  //Currency
  { path: '^/currency', roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: '^/currency/calc', roles: ['*'], methods: ['GET'], action: actions.allow },

  //Billing
  { path: '^/billing', roles: ['*'], methods: ['GET'], action: actions.allow },

  //Template
  { path: '^/template', roles: ['*'], methods: ['GET'], action: actions.allow },

  //Role
  { path: '^/role', roles: [r.admin], methods: ['GET'], action: actions.allow },

  //Orders
  { path: '^/order', roles: [r.admin, r.user], methods: ['POST', 'GET'], action: actions.allow },
  { path: `^/order/${intId}`, roles: [r.admin, r.user], methods: ['GET'], action: actions.allow },
  { path: `^/order/${intId}`, roles: [r.admin], methods: ['PUT', 'DELETE'], action: actions.allow },
  { path: '^/order/status', roles: ['*'], methods: ['POST'], action: actions.allow },
  { path: '^/order/statuses', roles: ['*'], methods: ['GET'], action: actions.allow },
];

rules.forEach(rule => (rule.path = new RegExp(rule.path)));
module.exports = {
  rules
}
