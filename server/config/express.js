var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    cardsRouter = require('../routes/routes.js');
    cardsController = require('../controllers/controller.js'),
    multer = require('multer'),
    upload = multer({dest: 'admin/images/'});
    methodOverride = require('method-override');

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

  //to be able to send PUT requests with form
  app.use(methodOverride('_method'));

  /* Serve static files */
    app.use('/admin', express.static(__dirname + '/../../admin'));

    app.use('/', express.static(__dirname + '/../../client'));

  //Handle file uploads
    app.post('/fileupload', upload.fields([{ name: 'front' }, { name: 'back' }]), function (req, res, next) {
        cardsController.create(req, res);
        res.redirect(path.resolve('/admin/#!/uploads'));
    });

  /* Use the cards router for requests to the api */
  app.use('/api/cards', cardsRouter);

 

  /* Go to homepage for all routes not specified */
   app.all('/admin/*', function (req, res) {
        res.sendFile(path.resolve('../admin/index.html'));
    });
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('../client/index.html'));
    });


  return app;
};
