/* eslint-disable no-param-reassign, max-len */
const { _ } = require('lodash');
const constants = require('../../helpers/constants');

const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
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
  { path: '^/test', roles: ['*'], methods: ['GET'], action: actions.allow },

  //Users
  { path: '^/user/auth', roles: ['*'], methods: ['POST'], action: actions.allow },
  { path: '^/user/sms', roles: ['*'], methods: ['POST'], action: actions.allow },
  { path: '^/user/info', roles: [r.user, r.admin], methods: ['GET'], action: actions.allow },
  { path: '^/user/update', roles: [r.user, r.admin], methods: ['PUT'], action: actions.allow },
  { path: '^/user/delete', roles: [r.user, r.admin], methods: ['DELETE'], action: actions.allow },

  //Services
  { path: '^/services', roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: `^/services/${intId}`, roles: ['*'], methods: ['GET'], action: actions.allow },
  { path: '^/services/add', roles: [r.admin], methods: ['POST'], action: actions.allow },
  { path: '^/services/edit', roles: [r.admin], methods: ['POST'], action: actions.allow },
  { path: '^/services/remove', roles: [r.admin], methods: ['DELETE'], action: actions.allow },
  { path: '^/services/upload', roles: [r.admin], methods: ['POST'], action: actions.allow },
  { path: '^/services/plan/add', roles: [r.admin], methods: ['POST'], action: actions.allow },
  { path: '^/services/plan/edit', roles: [r.admin], methods: ['POST'], action: actions.allow },
  { path: '^/services/plan/remove', roles: [r.admin], methods: ['DELETE'], action: actions.allow },
];

rules.forEach(rule => (rule.path = new RegExp(rule.path)));
module.exports = {
  rules
}
