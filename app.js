var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var passport = require('passport');

const bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var skillsRouter = require('./routes/skillRouter')
var usersRouter = require('./routes/userRouter');
var jobsRouter = require('./routes/jobRouter');
var adminsRouter = require('./routes/adminRouter');
var uploadRouter = require('./routes/uploadRouter');

var dbConfig = require('./config/database');

//To establish connection to database
const connect = mongoose.connect(dbConfig.mongoUrl+dbConfig.dbName,{ useNewUrlParser: true ,  useUnifiedTopology: true });
connect.then( (db) => {
  console.log('Success! - Successfully connected to database');
}, (err) => {
  console.log('Failed! - Error while connecting to db  - '+err);
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());



app.use('/api/users', usersRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    success : false,
    error : 'error 404',
    message : 'Page Not Found'
  });
});

// error handler
app.use(function(err, req, res, next) {

  /*
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
*/

  console.log(err);
  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  res.json({
    success : false,
    error : err.message,
    message : err.message
  });
});

module.exports = app;
