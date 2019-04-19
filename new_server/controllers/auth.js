var passport = require("passport");
var mongoose = require("mongoose");
var User = require("../models/users");

module.exports.register = function(req, res) {
  console.log(req);
  console.log(req.body)

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  console.log(user);

  user.save(function(err) {
    var token;

    // in case of error saving
    if (err) {
      res.status(400).send(err);
    }
    token = user.generateJwt();
    res.status(200).json({
      "token": token
    });
  });

};

module.exports.login = function(req, res) {
  passport.authenticate("local", function(err, user, info) {
    var token;

    // passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token": token
      });
      // user is not found
    } else {
      res.status(401).json(info);
    }
  })(req, res);

};
