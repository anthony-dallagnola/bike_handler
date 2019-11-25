const winston = require('winston');
// const winstonMail = require('winston-mail').Mail;
require('winston-mail');
require('winston-daily-rotate-file');
const httpContext = require('express-http-context');

// const Slack = require('winston-slack-transport');

// const serverName = require('../bin/www').serverName;
// var slackWebhook;
// switch(serverName) {
//   case 'local':
//     slackWebhook = 'https://hooks.slack.com/services/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';
//     break;
//   case 'dev':
//     slackWebhook = 'https://hooks.slack.com/services/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';
//     break;
//   case 'prod':
//     slackWebhook = 'https://hooks.slack.com/services/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';
//     break;
//   default:
//     slackWebhook = 'https://hooks.slack.com/services/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';
// }


var logger;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // ZZ
// connect, disconnect, query, task, transact and error
const PG_PROMISE = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  QUERY: 'query',
  TASK: 'task',
  TRANSACT: 'transact',
  ERROR: 'error'
};

function formatMomentDates(object) {
  // console.log('object: ' + util.inspect(object, false, null));
  // console.log('is object: ' + (typeof object === 'object'));
  // logObject(object);
  if(object != null && typeof object === 'object') {
    // console.log('object: ', object);
    for (var i = 0; i < Object.keys(object).length; i++) {
      var valueTemp = object[Object.keys(object)[i]];
      // console.log('meta: ' + valueTemp);
      if(valueTemp != null && typeof valueTemp === 'object' && valueTemp._isAMomentObject) {
        // console.log(valueTemp);
      // if(valueTemp instanceof moment) {
        // console.log('moment');
        object[Object.keys(object)[i]] = moment(valueTemp._d).format();
      } else {
        // console.log('not moment, call nested object');
        formatMomentDates(object[Object.keys(object)[i]]);
        // object[Object.keys(object)[i]] = formatMomentDates(valueTemp);
        // meta += JSON.stringify(metaTemp, null, 2);
      }
      // var field = options.meta[];
      // if()
    }
  } else {
    return object;
    // meta = '';
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

// const formatter = winston.format.printf(info => {

//   const {level, timestamp, message, ...args} = info;

//   formatMomentDates(args);

//   let colored = winston.format.colorize().colorize(
//     level,
//     `${timestamp} ${level}: ${message}`
//   );

//   return `${colored} ${Object.keys(args).length ? JSON.stringify(args, null, 2).replace(/\\n/g, '\n') : '' }`;
// });

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
          // console.log(obj, 'cycle at ' + key);
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

  const {level, timestamp, message, ...args} = info;
  let reqId = httpContext.get('reqId');
  reqId = typeof reqId !== 'undefined' ? ' [' + reqId + ']' : '';

  // console.log('args: ' + JSON.stringify(args, null, 2));
  let payload;
  if(!isCyclic(args)) {
    if (!info._error instanceof Error) {
      formatMomentDates(args);
    }
    payload = JSON.stringify(args, null, 2);
  } else {
    // console.log('cyclic');
    if (Object.keys(args).length) {
      // console.log('args: ', args);
      // payload = JSON.stringify(args, null, 2).replace(/\\n/g, '\n');
      payload = JSON.stringify(args, getCircularReplacer(), 2);
      // console.log('payload: ', payload);
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
  // let payload = Object.keys(args).length ? JSON.stringify(args, getCircularReplacer).replace(/\\n/g, '\n') : '';
  return {
    message: newMessage,
    payload
    // payload: Object.keys(args).length ? JSON.stringify(args, getCircularReplacer, 2).replace(/\\n/g, '\n') : ''
  }

});

const printer = winston.format.printf(info => {
  const {message, payload} = info;
  return `${message}${message === '' ? ' ' + payload : payload}`;
})

// const sendinblueLogger = winston.createLogger ({
//   transports: [
//     new winston.transports.File ({ filename: 'logs/sendinblue.log' })
//   ]
// });

// if (NODE_ENV === 'test'){
//   logger = winston.createLogger ({
//     transports: [
//       new winston.transports.File ({ filename: 'somefile.log' })
//     ]
//   });
//   logger.log('test environement');
// } else 
if (NODE_ENV === 'development'){
  logger = winston.createLogger ({
  	// format: winston.format.simple(),
    // levels: winston.config.syslog.levels, 
    // format: formatterLog,
    // winston.format.timestamp(),
    transports: [
      new winston.transports.Console ({
        format: winston.format.combine(
          winston.format.timestamp({format:DATE_FORMAT}),
          enumerateErrorFormat(),
          formatter({colorize:true}),
          printer       
        ),
        handleExceptions: true,
        level: 'debug'
      }),
      new winston.transports.DailyRotateFile({
        format: winston.format.combine(
          winston.format.timestamp({format:DATE_FORMAT}),
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
          winston.format.timestamp({format:DATE_FORMAT}),
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
          winston.format.timestamp({format:DATE_FORMAT}),
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
      // new Slack({
      //   webhook_url: slackWebhook,
      //   // channel: '#'+serverName,
      //   username: "ErrorBot",
      //   level: 'error',
      //   handleExceptions: true
      // })
      // new winston.transports.Mail({
      //   to: 'dev@synbird.com',
      //   from: 'synbird.test@gmail.com',
      //   subject: 'WS error' + serverName,
      //   host: 'smtp.gmail.com',
      //   username: 'synbird.test@gmail.com',
      //   password: 'synbird2016',
      //   ssl: true,
      //   level: 'error'
      // })
    ]
  });
  logger.log('verbose', 'dev environement');

} else if (NODE_ENV === 'production') {
  logger = winston.createLogger ({
    transports: [
      new winston.transports.Console ({
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
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};
logger.morganError = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.error(message);
  }
};
logger.pgPromise = ((msg, info) => {
  // console.log('msg');
  // console.log(msg);
  // console.log('info');
  // console.log(info);
  // logger.info(msg, info);
      // logger.info('before', {text: info.text});
  info.text = info.text.replace(/ {2,}/g, '\n$&');
      // logger.info('after', {text: info.text});
  switch(info.event) {
    case PG_PROMISE.QUERY:
      logger.info('', {query: info.text});
      // logger.log('info', '', info.text);
      break;
    case PG_PROMISE.ERROR:
      logger.error(info.text);
      break;
    default:
      logger.info(info.text);
  }
  // logger.info('', info.text);
  // regexp  {2+}
  info.display = false;
});

// logger = {
//   morgan: {
//     write: function(message, encoding) {
//       // use the 'info' log level so the output will be picked up by both transports (file and console)
//       logger.info(message);
//     }
//   },
//   morganError: {
//     write: function(message, encoding) {
//       // use the 'info' log level so the output will be picked up by both transports (file and console)
//       logger.error(message);
//     }
//   }
// };

module.exports = {
  logger
  // sendinblueLogger,
}