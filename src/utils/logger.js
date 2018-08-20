const winston = require('winston');

const registerLogger = (level = 'debug') => {
  // Config of logger system :
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    level: process.env.WINSTON || level || 'debug',
    prettyPrint: true,
    colorize: true,
    timestamp: true,
  });
};

module.exports = {
  logger: winston,
  registerLogger,
};