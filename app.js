var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//use mysql in this app
var mysql = require('mysql');
//create a 'pool' (group) of connections to be used for connecting with our SQL server
var dbConnectionPool = mysql.createPool({
  host: '127.0.0.1',
  user:'root',
  password: 'sny020515@',
  database:'neko'
});

var {google} = require('googleapis');
var session = require(`express-session`);


var app = express();

app.use(function(req,res,next) {
  req.pool = dbConnectionPool;
  next();
}); //from lecture

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'a string of your choice',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/calendar', calendarRouter);


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
