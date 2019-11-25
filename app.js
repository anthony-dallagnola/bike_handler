'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const loggerMorgan = require('morgan');
const httpContext = require('express-http-context');

const { FILE } = require('./config/constants')
const fs = require('fs');

// resets the file every time the server is launched
fs.copyFile(FILE.ORIGINAL_PATH, FILE.PATH, err => {
    if(err)
      logger.error('file couldn\'t be copied', { _error: err });
  }
);

var reqId = 0;


// initialize global variables
require('./config/config.js');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');




// log errors
app.use(loggerMorgan('tiny', {
  skip: ((req, res) => {
    return res.statusCode >= 400
  }),
  stream: logger.morgan
}));
app.use(loggerMorgan('tiny', {
  skip: ((req, res) => {
    return res.statusCode < 400
  }),
  stream: logger.morganError
}));


// from here on the request contains the data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, access-token');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200);
  }
  else {
    //move on
    next();
  }
});

app.use(httpContext.middleware);
// set a unique id to each request
app.use(function (req, res, next) {
  httpContext.set('reqId', reqId++);
  // httpContext.set('reqId', moment().format('HHmm-') + reqId++);
  next();
});


// log all requests
app.use(function (req, res, next) {
  logger.info('headers: ', { headers: req.headers });
  logger.info('start req: ' + req.method + " " + req.path);
  if (typeof req.body !== 'undefined' && Object.keys(req.body).length !== 0) {
    // if(typeof req.body.password !== 'undefined') delete req.body.password;
    const { password, ...rest } = req.body;
    logger.info('body: ', { body: rest });
  }
  if (typeof req.params !== 'undefined' && Object.keys(req.params).length !== 0) {
    logger.info('params: ', { params: req.params });
  }
  // GET
  if (typeof req.query !== 'undefined' && Object.keys(req.query).length !== 0) {
    logger.info('query: ', { query: req.query });
  }
  next();
});



// routes 
app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
