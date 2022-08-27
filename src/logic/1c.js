const request = require('request-promise-native');
const logger = require('../helpers/logger').getLogger();
const config = require('../config');

const tradeMark = '000000035';
const tradeMarkName = 'RedBox';

const skuStart = async (sku, shop, params) => {
    const uri = config.oneCApiUrl.replace(/(.+\/\/).+:.+@(.+)(ec)/, `$1${params.user}:${params.password}@$2Partners/RedBox/stop/sku-start?shopId=${shop.id}&TradeMark=${tradeMark}`);
    try {
        const options = {
          uri: uri,
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${params.user}:${params.password}`).toString('base64')
          },
          json: true,
          body: {
            shopId: shop.id,
            shopName: shop.name,
            SkuList: [sku],
            TradeMark: tradeMark,
            TradeMarkName: tradeMarkName,
          }
        };
        if (config.proxy) {
          options.proxy = config.proxy;
        }
        return await request(options);
      } catch (err) {
        logger.error({}, { message: 'Can\'t fetch information about stop skus from 1C', err });
        throw err;
      }
}

const skuStop = async (sku, shop, params) => {
    const uri = config.oneCApiUrl.replace(/(.+\/\/).+:.+@(.+)(ec)/, `$1${params.user}:${params.password}@$2Partners/RedBox/stop/sku-stop?shopId=${shop.id}&TradeMark=${tradeMark}`);
    try {
        const options = {
          uri: uri,
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${params.user}:${params.password}`).toString('base64')
          },
          json: true,
          body: {
            shopId: shop.id,
            shopName: shop.name,
            SkuList: [sku],
            TradeMark: tradeMark,
            TradeMarkName: tradeMarkName,
          }
        };
        if (config.proxy) {
          options.proxy = config.proxy;
        }
        return await request(options);
      } catch (err) {
        console.error('Can\'t fetch information about stop skus from 1C', err);
        throw err;
      }
}

const getStops = async (shopId, params) => {
  const uri = config.oneCApiUrl.replace(/(.+\/\/).+:.+@(.+)(ec)/, `$1${params.user}:${params.password}@$2Partners/RedBox/stop/sku-start?shopId=${shop.id}&TradeMark=${tradeMark}`);
  try {
      const options = {
        uri: uri,
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${params.user}:${params.password}`).toString('base64')
        },
        json: true,
      };
      if (config.proxy) {
        options.proxy = config.proxy;
      }
      return await request(options);
    } catch (err) {
      logger.error({}, { message: 'Can\'t fetch information about stop skus from 1C', err });
      throw err;
    }
}

module.exports = {
    skuStart,
    skuStop,
    getStops,
}