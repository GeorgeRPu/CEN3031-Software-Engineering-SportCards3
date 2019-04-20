var mongoose = require('mongoose'),
  path = require('path');
  User = require('../models/users.js'),
  bcrypt = require('bcrypt');

exports.createUser = function(req, res){
  var user = new User(req.body);

  user.save(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      console.log('User saved successfully!');
    }
  });
  //console.log(user);
}

exports.authenticate = function(req, res, callback){
  console.log(req.body);
  User.findOne({ username: req.body.username })
  .exec(function (err, user){
    if(err){
      return callback(err);
    }
    else if(!user){
      console.log("user not found");
      var err = new Error('User not found.')
      err.status = 401;
      return callback(err);
      //res.redirect(path.resolve('/admin/login'));
    }
    bcrypt.compare(req.body.password, user.password, function(err, result){
      if(result === true){
        console.log('Authenticated!');
        return callback(null, user);
      }
    })
  });
}

exports.requireLogin = function(req, res, next){
  console.log("REQUIRE LOGIN");
  console.log(req.session);
  console.log(req.session.sessionId);
  if(req.session && req.session.sessionId){
    return next();
  }
  else{
    res.redirect(path.resolve('/login'));
  }
}
