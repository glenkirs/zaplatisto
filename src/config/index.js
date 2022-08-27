const env = process.env;
const environment = env.NODE_ENV || 'development';
const serviceName = env.SERVICE_NAME || 'iiko';

const host = env.SERVICE_HOST || 'localhost';

const iikoApiUrl = env.IIKO_API_URL || 'https://api-ru.iiko.services/api/1/';
const oneCApiUrl = env.ONEC_API_URL || 'http://ec:654159@web1c-test.2-berega.ru/1test/hs/ec';
const proxy = env.PROXY_URL || 'http://squid-proxy:3128';

const defaultConfig = {
  serviceName,
  environment,
  host,
  iikoApiUrl,
  oneCApiUrl,
  proxy,
};

const config = {
  development: {
    port: env.SERVICE_PORT || 8101,
    services: {
      catalog: env.SERVICES_CATALOG_URI || 'http://localhost:8081',
      order: env.SERVICES_ORDER_URI || 'http://localhost:8084',
      account: env.SERVICES_ACCOUNT_URI || 'http://localhost:8082',
    },
    robots: {},
  },
  production: {
    port: env.SERVICE_PORT || 8080,
    services: {
      catalog: env.SERVICES_CATALOG_URI || 'http://catalog:8080',
      order: env.SERVICES_ORDER_URI || 'http://order:8080',
      account: env.SERVICES_ACCOUNT_URI || 'http://account:8080',
    },
    robots: {},
  },

};

module.exports = { ...defaultConfig, ...config[environment] };
