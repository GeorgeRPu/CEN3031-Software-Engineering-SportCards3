var mongoose = require('mongoose'),
  Card = require('../models/cards.js'),
  fs = require('fs'),
  rotate = require('jpeg-autorotate');

const {
  Storage
} = require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'sports-cards-test',
    //credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS) //Uncomment this for heroku, comment out for localhost
    keyFilename: './server/config/Sports-Cards-Test-d297e1566afe.json' //Uncomment this for localhost, comment out for heroku
});


const bucketName = 'sport-cards-bucket';
const bucket = storage.bucket(bucketName);

//uploads images to google cloud, saves new card
exports.create = async function (req, res) {
  var card = new Card(req.body);
  card.otherInfo = req.body.specialInfo.split(", ");
  card.imgFront = req.files['front'][0].filename;
  card.imgBack = req.files['back'][0].filename;
  var path = './admin/images/';
  var front = card.imgFront;
  var back = card.imgBack;
  var x = 0;

  async function fixOrientation(imgPath, callback){
    await rotate.rotate(imgPath, {quality: 85}, (error, buffer, orientation, dimensions, quality) => {
      if (error) {
        console.log(error);
        callback(imgPath, saveCard);
        return;
      }
      fs.unlinkSync(imgPath);
      fs.writeFile(imgPath + '-1', buffer, function(err, result){
        if(err) console.log(err);
      })
      callback(imgPath, saveCard);
    })
  }

  async function upload(imgPath, callback){
    await bucket.upload(imgPath, {
      metadata: {
        contentType: "image/*",
        cacheControl: 'public, max-age=31536000'
      }
    });

    fs.unlinkSync(imgPath);
    x++;
    callback();

  }

  async function saveCard(){
    if(x==2){
      card.save(function (err) {
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

/* Read */
exports.read = function (req, res) {
  res.json(req.card);
};

/* Update */
exports.update = function (req, res) {
  var card = req.card;

  /*We need to check if the particular req.body field exists before doing these assignment statements :) */

  Card.findById(card._id, function (err, card) {

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

    card.save(function (err) {
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

/* Delete */
exports.delete = function (req, res) {
  var card = req.card;

  if(card.imgFront)
  bucket.file(card.imgFront).delete();

  if(card.imgBack)
  bucket.file(card.imgBack).delete();

  Card.findOneAndRemove({
    '_id': card._id
  }, function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.end();
    }
  })
};

/* Sort by playerName */
//Will add more sorting functions later for other categories
exports.list = function (req, res) {
  Card.find({}, function (err, data) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      data.sort(function (a, b) {
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

exports.cardByID = function (req, res, next, id) {
  Card.findById(id).exec(function (err, card) {
    if (err) {
      res.status(400).send(err);
    } else {
      req.card = card;
      next();
    }
  });
};
