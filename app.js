var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
sessions = require("express-session");
var compression = require('compression');
var MongoStore = require('connect-mongo');

// import routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// initialize the express object
var app = express();

// configure mongodb and connect to server
const mongoose = require("mongoose");
const dbConfig = require('./database/config');

if (app.get('env') === 'development') {
  mongoose.connect(`mongodb://${dbConfig.offline.hostname}:${dbConfig.offline.port.toString()}/${dbConfig.offline.dbname}`);
} else {
  mongoose.connect(
    `mongodb://${dbConfig.online.username}:${dbConfig.online.password}@${dbConfig.online.hostname}/${dbConfig.online.dbname}?authSource=admin&readPreference=primary&directConnection=true`);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (app.get('env') === 'production') {
  app.use(logger("combined"));
} else {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

// set the session data
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "LMPs6YM2jqn1UbiKHcBBtFcoMrZw37Ev",
    store: MongoStore.create({
      // specify connection string to the mongodb database to store the sessions in
      mongoUrl: app.get('env') === 'development' ? 
                `mongodb://${dbConfig.offline.hostname}:${dbConfig.offline.port.toString()}/${dbConfig.sessionDb}` : 
                `mongodb://${dbConfig.online.username}:${dbConfig.online.password}@${dbConfig.online.hostname}/${dbConfig.sessionDb}?authSource=admin&readPreference=primary&directConnection=true`,
      // remove expired sessions at 10 minutes intervals
      autoRemove: "interval",
      autoRemoveInterval: 10,
      // encrypt session data
      crypto: {
        secret: 'afrilogic'
      }
    }),
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// set the routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
