//initialization
process.env.VUE_APP_API_KEY = 'AIzaSyBdudQyn0ECon1ggxM-i3t4xhbQTVYAgLA';

process.env.MONGODB_URI = 'mongodb+srv://arshuvo:ars123456789@tran-chitrodb-hge7d.mongodb.net/tran-chitro?retryWrites=true&w=majority';
require('./db/mongoose');

const history = require('connect-history-api-fallback');
const cors = require('cors');
const bodyParser=require('body-parser');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Routers
const indexRouter = require('./routes');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//SPA Handling
const staticFileMiddleware = express.static(path.join(__dirname+'/dist'));
app.use(staticFileMiddleware);
app.use(history());
app.use(staticFileMiddleware);
app.use(bodyParser.json());
app.use(cors());

//INDEX ROUTES
app.use('/', indexRouter);

//API ROUTES
app.use('/api', apiRouter);
app.use('/api/login', apiRouter);

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
