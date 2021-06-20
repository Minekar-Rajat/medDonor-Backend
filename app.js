var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Allrouter = require('./routes/All');
var reqRouter = require('./routes/Requests');
var donationRouter = require('./routes/Donations');
var uploadRouter = require('./routes/upload');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const config = require('./config');
const url = config.mongoURL;

const mongoose = require('mongoose');
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

connect.then(() => {
  console.log("Database Connection is successful");
}, err => {
  console.log("Connection Error\n");
  console.log(err);
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/all', Allrouter);
app.use('/request', reqRouter);
app.use('/donation', donationRouter);
app.use('/users', usersRouter);
app.use('/imageUpload', uploadRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
