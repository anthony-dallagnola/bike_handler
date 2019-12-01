const winston = require('winston');
// const winstonMail = require('winston-mail').Mail;
require('winston-mail');
require('winston-daily-rotate-file');
const httpContext = require('express-http-context');
var logger;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // ZZ

if (NODE_ENV !== 'test') {

  function formatMomentDates(object) {
    if (object != null && typeof object === 'object') {
      for (var i = 0; i < Object.keys(object).length; i++) {
        var valueTemp = object[Object.keys(object)[i]];
        if (valueTemp != null && typeof valueTemp === 'object' && valueTemp._isAMomentObject) {
          object[Object.keys(object)[i]] = moment(valueTemp._d).format();
        } else {
          formatMomentDates(object[Object.keys(object)[i]]);
        }
      }
    } else {
      return object;
    }
  }
  const enumerateErrorFormat = winston.format(info => {
    if (info._error instanceof Error) {
      info._error = {
        message: info._error.message,
        stack: info._error.stack,
        ...info._error
      };
    }
    return info;
  });
  function isCyclic(obj) {
    var seenObjects = [];

    function detect(obj) {
      if (obj && typeof obj === 'object') {
        if (seenObjects.indexOf(obj) !== -1) {
          return true;
        }
        seenObjects.push(obj);
        for (var key in obj) {
          if (obj.hasOwnProperty && obj.hasOwnProperty(key) && detect(obj[key])) {
            return true;
          }
        }
      }
      return false;
    }

    return detect(obj);
  }

  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  const formatter = winston.format((info, opts) => {

    const { level, timestamp, message, ...args } = info;
    let reqId = httpContext.get('reqId');
    reqId = typeof reqId !== 'undefined' ? ' [' + reqId + ']' : '';

    let payload;
    if (!isCyclic(args)) {
      if (!info._error instanceof Error) {
        formatMomentDates(args);
      }
      payload = JSON.stringify(args, null, 2);
    } else {
      if (Object.keys(args).length) {
        payload = JSON.stringify(args, getCircularReplacer(), 2);
      }
    }
    payload = payload.replace(/\\n/g, '\n  ');
    let newMessage;
    if (opts.colorize) {
      newMessage = winston.format.colorize().colorize(
        level,
        `${timestamp}${reqId} ${level}: ${message}`
      );
    } else {
      newMessage = `${timestamp}${reqId} ${level}: ${message}`;
    }
    return {
      message: newMessage,
      payload
    }

  });

  const printer = winston.format.printf(info => {
    const { message, payload } = info;
    return `${message}${message === '' ? ' ' + payload : payload}`;
  })
  if (NODE_ENV === 'development') {
    logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: DATE_FORMAT }),
            enumerateErrorFormat(),
            formatter({ colorize: true }),
            printer
          ),
          handleExceptions: true,
          level: 'debug'
        }),
        new winston.transports.DailyRotateFile({
          format: winston.format.combine(
            winston.format.timestamp({ format: DATE_FORMAT }),
            enumerateErrorFormat(),
            formatter(),
            printer
          ),
          filename: '%DATE%-verbose.log',
          dirname: 'logs',
          maxSize: '200m',
          maxFiles: '7d',
          level: 'verbose'
        }),
        new winston.transports.DailyRotateFile({
          format: winston.format.combine(
            winston.format.timestamp({ format: DATE_FORMAT }),
            enumerateErrorFormat(),
            formatter(),
            printer
          ),
          filename: '%DATE%-info.log',
          dirname: 'logs',
          maxSize: '200m',
          maxFiles: '14d',
          level: 'info'
        }),
        new winston.transports.DailyRotateFile({
          format: winston.format.combine(
            winston.format.timestamp({ format: DATE_FORMAT }),
            enumerateErrorFormat(),
            formatter(),
            printer
          ),
          filename: '%DATE%-error.log',
          dirname: 'logs',
          maxSize: '200m',
          maxFiles: '14d',
          level: 'error'
        }),
      ]
    });
    logger.log('verbose', 'dev environement');

  } else if (NODE_ENV === 'production') {
    logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          timestamp: function () {
            return (new Date()).toISOString();
          }
        }),
      ]
    });
    logger.log('prod environement');
  }

  logger.morgan = {
    write: function (message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info(message);
    }
  };
  logger.morganError = {
    write: function (message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.error(message);
    }
  };

} else {
  logger = { verbose: () => { }, info: () => { }, error: () => { } };
}

module.exports = {
  logger
}