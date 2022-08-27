const env = process.env;
const environment = env.NODE_ENV || 'development';
const serviceName = env.SERVICE_NAME || 'backend';

const host = env.SERVICE_HOST || 'localhost';

const jwtSecret = env.JWT_SECRET || 'secret2';
const expiresIn = env.EXPIRES_IN || '30d';

const defaultConfig = {
  serviceName,
  environment,
  host,
  jwtSecret,
  expiresIn,
};

const config = {
  development: {
    port: env.SERVICE_PORT || 3000,
  },
  production: {
    port: env.SERVICE_PORT || 3000,
  },

};

module.exports = { ...defaultConfig, ...config[environment] };
