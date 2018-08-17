import winston from 'winston';

export const registerLogger = (level = 'debug') => {
  // Config of logger system :
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    level      : process.env.WINSTON || level || 'debug',
    prettyPrint: true,
    colorize   : true,
    timestamp  : true,
  });
};

export default winston;