const env = process.env;
const { addSQLStats } = require('../helpers/requestState');
const logger = require('../helpers/logger').getLogger();
const { _ } = require('lodash');

module.exports = {
  username: 'zaplatista_dev',
  password: 'HiNvkvz6GryFXM6rtHnN',
  database: 'zaplatisto',
  host: 'database',
  port: env.SEQUELIZE_PORT || '3306',
  dialect: env.SEQUELIZE_DIALECT || 'mysql',
  log: env.SEQUELIZE_LOG || 'enabled',
  options: {
    benchmark: true,
    dialectOptions: { decimalNumbers: true },
    operatorsAliases: false,
  },
  pool: {
    max: env.SEQUELIZE_POOL_MAX || 100,
    min: env.SEQUELIZE_POOL_MIN || 0,
    acquire: env.SEQUELIZE_POOL_ACQUIRE || 30000,
    idle: env.SEQUELIZE_POOL_IDLE || 10000,
  },
  logging : (...msg) => {
    const sql = msg[0];
    const sqlDuration = msg[1];
    const state = _.get(msg[2], 'state', {});
    const { requestId } = state;
  
    logger.trace(state, { sql });
    addSQLStats(requestId, 1, sqlDuration);
  }
};
