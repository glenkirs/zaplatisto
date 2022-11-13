const env = process.env;
const environment = env.NODE_ENV || 'development';
const serviceName = env.SERVICE_NAME || 'backend';

const host = env.SERVICE_HOST || 'localhost';

const jwtSecret = env.JWT_SECRET || 'secret2';
const expiresIn = env.EXPIRES_IN || '30d';
const sms = {
  login: env.SMS_LOGIN || 'zaplatisto',
  password: env.SMS_PASSWORD || 'zxcasd12'
}
const payment = {
  terminal: env.PAY_TERMINAL || '1655154920104DEMO',
  password: env.PAY_PASSWORD || '3yk5r1fb50ek51tu'
}

const defaultConfig = {
  serviceName,
  environment,
  host,
  jwtSecret,
  expiresIn,
  sms,
  payment
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
