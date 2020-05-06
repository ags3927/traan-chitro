//initialization
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    console.log("DEV ENVIRONMENT");
    process.env.MONGODB_URI = 'mongodb://localhost:27017/traan-chitro-test';
    process.env.NODE_ENV = 'development';
    process.env.PORT = 3000;
}

const {mongoose} = require('./db/mongoose');

const history = require('connect-history-api-fallback');
const cors = require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const rateLimiter = require('./middlwares/rateLimit');
const authenticator = require('./middlwares/authenticate');

//Routers
const indexRouter = require('./routes');
const apiRouter = require('./routes/api');

const app = express();

//Rate Limiters and Authenticators
// app.use(rateLimiter.rateLimiterMiddlewareBefore);
app.use(authenticator.handleAuthentication);
// app.use(rateLimiter.rateLimiterMiddlewareInMemoryWithAuthChecking);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//SPA Handling
const staticFileMiddleware = express.static(path.join(__dirname + '/dist'));
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
});

//404
app.get('*', function (req, res) {
    res.status(404).send('404');
});

process.on('SIGINT', async function () {
    //todo shift from console.error to something more...reasonable
    console.error('SIGINT called');
    await mongoose.disconnect();
    console.error('Mongoose connection terminated');
    process.exit(0);
});

process.on('SIGTERM', async function () {
    console.error('SIGTERM called');
    await mongoose.disconnect();
    console.error('Mongoose connection terminated');
    process.exit(0);
});

module.exports = app;
