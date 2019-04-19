var express = require('express');
var jwt = require('express-jwt');
var config = require('../config/config')

var router = express.Router();

var auth = jwt({
  secret: process.env.SECRET || config.secret,
  userProperty: "payload"
});

var authController = require('../controllers/auth');

// authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
