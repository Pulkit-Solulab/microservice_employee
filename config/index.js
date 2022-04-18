const path = require('path');

const bunyan = require('bunyan');

// Get some meta info from the package.json
const { name, version } = require('../package.json');

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    name,
    version,
    serviceRegisterInterval: process.env.SERVICE_REGISTER_INTERVAL || 60,
    serviceRegisterUrl: process.env.SERVICE_REGISTER_URL,
    log: () => getLogger(name, version, 'debug'),
  },
  production: {
    name,
    version,
    serviceRegisterInterval: process.env.SERVICE_REGISTER_INTERVAL || 60,
    serviceRegisterUrl: process.env.SERVICE_REGISTER_URL,
    log: () => getLogger(name, version, 'info'),
  },
  test: {
    name,
    version,
    serviceRegisterInterval: process.env.SERVICE_REGISTER_INTERVAL || 60,
    serviceRegisterUrl: process.env.SERVICE_REGISTER_URL,
    log: () => getLogger(name, version, 'fatal'),
  },
};