//initialization
process.env.VUE_APP_API_KEY = 'AIzaSyBdudQyn0ECon1ggxM-i3t4xhbQTVYAgLA';

process.env.MONGODB_URI = 'mongodb+srv://arshuvo:ars123456789@tran-chitrodb-hge7d.mongodb.net/tran-chitro?retryWrites=true&w=majority';
require('db/mongoose');

let history = require('connect-history-api-fallback');
let cors = require('cors');
let bodyParser=require('body-parser');
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//Routers
let indexRouter = require('./routes');
let apiRouter = require('./routes/api');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//SPA Handling
let staticFileMiddleware = express.static(path.join(__dirname+'/dist'));
app.use(staticFileMiddleware);
app.use(history());
app.use(staticFileMiddleware);
app.use(bodyParser.json());
app.use(cors());

//INDEX ROUTES
app.use('/', indexRouter);

//API ROUTES
app.use('/api', apiRouter);

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

//404
app.get('*', function(req, res) {
  res.status(404).render('404');
});

module.exports = app;
