var mongoose = require('mongoose');
var Card = require('../models/cards');
var fs = require('fs');
var rotate = require('jpeg-autorotate');
var { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'sports-cards-test',
  //credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS) // uncomment for heroku, comment for localhost
  keyFilename: './server/config/Sports-Cards-Test-d297e1566afe.json' // uncomment for localhost, comment for heroku
});

const bucketName = 'sport-cards-bucket';
const bucket = storage.bucket(bucketName);

// uploads images to google cloud, saves new card
exports.create = async function(req, res) {
  var card = new Card(req.body);
  card.otherInfo = req.body.specialInfo.split(", ");
  card.imgFront = req.files['front'][0].filename;
  card.imgBack = req.files['back'][0].filename;
  var path = './admin/images/';
  var front = card.imgFront;
  var back = card.imgBack;
  var x = 0;

  async function fixOrientation(imgPath, callback) {
    await rotate.rotate(imgPath, {
      quality: 40
    }, (error, buffer, orientation, dimensions, quality) => {
      if (error) {
        console.log(error);
        callback(imgPath, saveCard);
        return;
      }
      fs.unlinkSync(imgPath);
      fs.writeFile(imgPath, buffer, function(err, result) {
        if (err) console.log(err);
      })
      callback(imgPath, saveCard);
    })
  }

  async function upload(imgPath, callback) {
    await bucket.upload(imgPath, {
      metadata: {
        contentType: "image/png",
        cacheControl: 'public, max-age=31536000'
      }
    });

    fs.unlinkSync(imgPath);
    x++;
    callback();

  }

  async function saveCard() {
    if (x == 2) {
      card.save(function(err) {
        console.log("saving");
        if (err) {
          console.log(err);
          res.status(400).send(err);
        };
      })
    }
  }

  fixOrientation(path + front, upload);
  fixOrientation(path + back, upload);
};

// read a card
exports.read = function(req, res) {
  res.json(req.card);
};

// update a card
exports.update = function(req, res) {
  var card = req.card;

  // nned to check if req.body field exists before assignment
  Card.findById(card._id, function(err, card) {
    if (err) throw err;
    console.log(req.body);

    const cardProperties = [
      'imgFront', 'imgBack',
      'playerName', 'year',
      'manufacturer', 'cardNum',
      'team', 'otherInfo',
      'quantity', 'sold',
      'display'
    ];

    for (const property of cardProperties) {
      if (req.body[property])
        card[property] = req.body[property];
    }

    card.updated_at = new Date();

    card.save(function(err) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(card);
        console.log('Card saved successfully!');
      }
    });
  })
};

// delete a card
exports.delete = function(req, res) {
  var card = req.card;

  if (card.imgFront)
    bucket.file(card.imgFront).delete();

  if (card.imgBack)
    bucket.file(card.imgBack).delete();

  Card.findOneAndRemove({
    '_id': card._id
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.end();
    }
  })
};

// sort by player name
exports.list = function(req, res) {
  Card.find({}, function(err, data) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      data.sort(function(a, b) {
        if (a.playerName > b.playerName) {
          return 1;
        } else if (a.playerName < b.playerName) {
          return -1;
        } else {
          return 0;
        }
      });
      res.json(data);
    }
  });
};

exports.cardByID = function(req, res, next, id) {
  Card.findById(id).exec(function(err, card) {
    if (err) {
      res.status(400).send(err);
    } else {
      req.card = card;
      next();
    }
  });
};
