const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const http = require('http');

const app = require('./app')
const server = http.createServer(app);
const config = require('../config/')[process.env.NODE_ENV || 'development'];
const log = config.log();

server.listen(0)

server.on('listening', () => {
  const registerService = () => axios.put(`${config.serviceRegisterUrl}/register/${config.name}/${config.version}/${server.address().port}`);
  const unregisterService = () => axios.delete(`${config.serviceRegisterUrl}/register/${config.name}/${config.version}/${server.address().port}`);

  registerService();

  const interval = setInterval(registerService, +config.serviceRegisterInterval*1000);
  const cleanup = async () => {
    clearInterval(interval);
    await unregisterService();
  };

  process.on('uncaughtException', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(
    `Employee Services up on Port ${server.address().port} in ${app.get('env')} mode.`,
  );
});