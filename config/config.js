const monitor = require('pg-monitor');

// set NODE_ENV
NODE_ENV = process.env.NODE_ENV || 'development';

// redefine logger
logger = require('./winston').logger;


const pgPromiseOptions = {
  // Initialization Options
  // promiseLib: promise,
  capSQL: true
  // connect(client, dc, useCount) {
  //   const cp = client.connectionParameters;
  //   logger.info('Connect to DB, pg-promise: ', {processID: client.processID, cp});
  //   // console.log('connect to BD: ', client.processID, cp);
  // }
};

pgp = require('pg-promise')(pgPromiseOptions);
const connectionString = 'postgres://postgres@localhost:5434/account';
db = pgp(connectionString);