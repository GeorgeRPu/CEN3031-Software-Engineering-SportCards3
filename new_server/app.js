var bodyParser = require('body-parser');
var path = require('path');
var express = require('express');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var morgan = require('morgan');
var multer = require('multer');
var passport = require('passport');

var config = require('./config/config');
var authRouter = require('./routes/auth')
var cardsRouter = require('./routes/cards');
var cardsController = require('./controllers/cards');

var upload = multer({dest: 'admin/images/'});

require('./passport');

// connect to databases
mongoose.connect(config.cardsUri);
mongoose.connect(config.usersUri);

var app = express();
// enable request logging for development debugging
app.use(morgan('dev'));
// body parsing middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// to be able to send PUT requests with form
app.use(methodOverride('_method'));

// serve static files
app.use('/', express.static(__dirname + '/../new_client'));

// user cardsRouter for cards api
app.use('/api/cards', cardsRouter);

// user authRouter for auth api
app.use('/api/auth', authRouter);

// handle file uploads
app.post(
  '/admin/fileupload',
  upload.fields([{
    name: 'front'
  }, {
    name: 'back'
  }]),
  function(req, res, next) {
    cardsController.create(req, res);
    res.redirect(path.resolve('/admin/upload'));
  }
);

module.exports = app;
