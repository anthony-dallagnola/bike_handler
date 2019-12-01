// set NODE_ENV
NODE_ENV = process.env.NODE_ENV || 'development';

console.log('NODE_ENV: ', NODE_ENV);
// redefine logger
logger = require('./winston').logger;