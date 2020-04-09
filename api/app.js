var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var path = require('path');
var _root = path.resolve(__dirname, '..')

var fetchAllData = require('./routes/fetchAllData');
var routes = require('./routes/routes');
var predictions = require('./routes/predictions');
var schedules = require("./routes/schedules");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join.apply(path, [_root].concat(['client', 'build']))));
// for single-container docker build file structure use below path
// app.use(express.static(path.join.apply(path, [__dirname].concat(['client', 'build']))));

app.use('/data', fetchAllData);
app.use('/routes', routes);
app.use('/predictions', predictions);
app.use('/schedules', schedules);

app.get('*', (req,res) =>{
    res.sendFile(path.join.apply(path, [_root].concat(['client', 'build', 'index.html'])));
});

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
