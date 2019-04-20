var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    cardsRouter = require('../routes/routes.js');
    cardsController = require('../controllers/controller.js'),
    usersController = require('../controllers/users-controller.js'),
    multer = require('multer'),
    upload = multer({dest: 'admin/images/'}),
    methodOverride = require('method-override'),
    session = require('express-session'),
    uuidv4 = require('uuid/v4');


module.exports.init = function() {
  //connect to database
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(session({
    secret: 'Enigmatic Potato',
    resave: true,
    saveUninitialized: false
  }));

  //to be able to send PUT requests with form
  app.use(methodOverride('_method'));

  /* Serve static files */
  app.use('/admin', express.static(__dirname + '/../../admin'));

  app.use('/', express.static(__dirname + '/../../client'));

  //Handle file uploads
  app.post('/admin/fileupload', upload.fields([{name:'front'}, {name:'back'}]), function(req, res, next){
    cardsController.create(req, res);
    res.redirect(path.resolve('/admin/upload'));
  });

  //Registers a new user after /admin/register form is filled out
  app.post('/admin/createuser', function(req, res){
    usersController.createUser(req, res);
    res.redirect(path.resolve('/admin'));
  })

  //Handles login
  app.post('/adminlogin', function(req, res){
    //Authenticate the user
    usersController.authenticate(req, res, function(error, user){
      if(error || !user){
        console.log("error");
        res.redirect(path.resolve('/login'));
      }
      else {
        //Set session ID to keep the user logged in until they logout or close the browser window
        req.session.sessionId = uuidv4();
        console.log(req.session.sessionId);
        res.redirect(path.resolve('/admin'));
      }
    });
  })

  app.post('/admin/logout', function(req, res){
    if (req.session) {
    // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        }
        else {
          console.log('Logged out');
          return res.redirect('/');
        }
      });
    }
  })

  /* Use the cards router for requests to the api */
  app.use('/api/cards', cardsRouter);

  app.all('/admin/catalog', usersController.requireLogin, function (req, res) {
      res.sendFile(path.resolve(__dirname + '/../../admin/index.html'));
  });

  app.all('/admin/upload', usersController.requireLogin, function (req, res) {
      res.sendFile(path.resolve(__dirname + '/../../admin/index.html'));
  });

  /* Go to homepage for all routes not specified */
  app.all('/admin/*', function (req, res) {
      res.sendFile(path.resolve(__dirname + '/../../admin/index.html'));
  });
  app.all('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../../client/index.html'));
  });


  return app;
};
