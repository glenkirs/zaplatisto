const request = require('request-promise-native');
const config = require('../../config');
const logger = require('../../helpers/logger').getLogger();

const uri = config.services.account;
const service = 'service-telephony';
const user = JSON.stringify({ role: service });
const makeHeaders = state => ({ 'X-Request-Id': state.requestId, user, service });

const getMarkets = async (query = {}, params = {}) => {
  try {
    const options = {
      uri: `${uri}/account/markets`,
      body: query,
      method: 'GET',
      headers: makeHeaders(params),
      json: true,
    };
    return await request(options);
  } catch (err) {
    logger.error({ message: 'services.account.markets.getMarkets', err });

    return [];
  }
};

const getMarket = async marketId => {
  try {
    const options = {
      uri: `${uri}/account/markets/${marketId}`,
      body: {},
      method: 'GET',
      headers: makeHeaders({}),
      json: true,
    };
    return await request(options);
  } catch (err) {
    logger.error({ message: 'services.account.markets.getMarket', err });

    return [];
  }
};

const getShop = async shopId => {
  try {
    const options = {
      uri: `${uri}/account/shops/${shopId}`,
      body: {},
      method: 'GET',
      headers: makeHeaders({}),
      json: true,
    };
    return await request(options);
  } catch (err) {
    logger.error({ message: 'services.account.markets.getShop', err });

    return [];
  }
};

module.exports = { 
  getMarkets,
  getMarket,
  getShop,
};
