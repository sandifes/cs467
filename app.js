require('dotenv').config();

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var db = require('./db');
var express = require('express');
var logger = require('morgan');
var passport = require('passport')
var path = require('path');
var session = require('express-session')
var Strategy = require('passport-local').Strategy;

// create express app
var app = express();

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      user.isAdmin = (user.account_type === 1);
      return cb(null, user);
    });
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    user.isAdmin = (user.account_type === 1);
    cb(null, user);
  });
});

// Passport and session handling initialization
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// TODO: move the below routes to use express router

app.get('/',
  function(req, res) {
    res.render('index', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/register',
  function(req, res){
    res.render('register');
  });
  
app.post('/register', 
  function(req, res) {
    db.users.registerNewUser(req.body, function (err, user) {
      if (err) { 
        res.render('register', { message: 'error registering user' });
      }
      else {
        res.render('login', { message: 'registered user successfully' });
      }
    });
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  })

app.get('/users', 
  function(req, res) {
    db.users.findAllUsers(function (err, rows) {
      if (err) { 
        res.render('error', { message: 'error finding all users' });
      }
      else {
        res.render('users', { users: rows });
      }
    });
  });

app.get('/awards', 
  function(req, res) {
    db.awards.findAllAwards(function (err, rows) {
      if (err) { 
        res.render('error', { message: 'error finding all awards' });
      }
      else {
        res.render('awards', { awards: rows });
      }
    });
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
