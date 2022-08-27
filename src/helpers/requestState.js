const _ = require('lodash');

const state = {};

const addSQLStats = (requestId, count, duration) => {
  if (!requestId) return;
  const sql = _.get(state, `${requestId}.sql`, { c: 0, d: 0 });
  sql.c += count;
  sql.d += duration;
  _.set(state, `${requestId}.sql`, sql);
};

const popRequestState = (requestId) => {
  const result = _.cloneDeep(_.get(state, requestId, {}));
  delete state[requestId];

  return result;
};

module.exports = {
  addSQLStats,
  popRequestState,
};
