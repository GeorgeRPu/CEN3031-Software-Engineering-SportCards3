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

exports.authenticate = function(req, res){
  console.log(req.body);
  User.findOne({ username: req.body.username })
  .exec(function (err, user){
    if(err){
      return;
    }
    else if(!user){
      console.log('User not found!');
      err.status = 401;
      return;
    }
    bcrypt.compare(req.body.password, user.password, function(err, result){
      if(result === true){
        console.log('Authenticated!');
      }
    })
  });
}

exports.requireLogin = function(req, res, next){
  if(req.session && req.session.sessionId){
    return next();
  }
  else{
    res.redirect(path.resolve('/admin/login'));
  }
}
