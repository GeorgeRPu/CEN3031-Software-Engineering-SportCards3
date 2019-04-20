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
}

//Authenticate user login info
exports.authenticate = function(req, res, callback){
  console.log(req.body);
  User.findOne({ username: req.body.username })
  .exec(function (err, user){
    if(err){
      return callback(err);
    }
    else if(!user){
      console.log("User not found.");
      var err = new Error('User not found.')
      err.status = 401;
      return callback(err);
    }
    //Compare hashed password typed on login to hashed password stored in DB
    bcrypt.compare(req.body.password, user.password, function(err, result){
      if(result === true){
        console.log('Authenticated!');
        return callback(null, user);
      }
    })
  });
}

//Middleware that blocks access to certain pages if not logged in
exports.requireLogin = function(req, res, next){
  if(req.session && req.session.sessionId){
    return next();
  }
  else{
    res.redirect(path.resolve('/login'));
  }
}
