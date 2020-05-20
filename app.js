var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var passport = require('passport');




var indexRouter = require('./routes/index');
var skillsRouter = require('./routes/skills')
var usersRouter = require('./routes/users');
var jobsRouter = require('./routes/jobs');
var adminsRouter = require('./routes/admins');

var dbConfig = require('./config/database');

//To establish connection to database
const connect = mongoose.connect(dbConfig.mongoUrl+dbConfig.dbName);
connect.then( (db) => {
  console.log('Success! - Successfully connected to database');
}, (err) => {
  console.log('Failed! - Error while connecting to db  - '+err);
})


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/skills', skillsRouter);

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
