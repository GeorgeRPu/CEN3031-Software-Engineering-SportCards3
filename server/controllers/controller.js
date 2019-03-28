var mongoose = require('mongoose'),
  Card = require('../models/cards.js'),
  fs = require('fs');

const {
  Storage
} = require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'sports-cards-test',
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS) //Uncomment this for heroku, comment out for localhost
    //keyFilename: './server/config/Sports-Cards-Test-d297e1566afe.json' //Uncomment this for localhost, comment out for heroku
});


const bucketName = 'sport-cards-bucket';
const bucket = storage.bucket(bucketName);

//uploads images to google cloud, saves new card
exports.addImage = async function (req, res) {
  var card = new Card(req.body);
  card.imgFront = req.files['front'][0].filename;
  card.imgBack = req.files['back'][0].filename;
  var path = './client/images/';
  var front = card.imgFront;
  var back = card.imgBack;

  await bucket.upload(path + front, {
    metadata: {
      contentType: "image/png"
    }
  });
  await bucket.upload(path + back, {
    metadata: {
      contentType: "image/png"
    }
  });

  fs.unlinkSync(path + front);
  fs.unlinkSync(path + back);

  card.save(function (err) {
    console.log("saving");
    if (err) {
      console.log(err);
      res.status(400).send(err);
    };
  });
};
/* Create */
exports.create = function (req, res) {

  var card = new Card(req.body);

  card.save(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(card);
    }
  });
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

    if (req.body.imgFront)
      card.imgFront = req.body.imgFront;

    if (req.body.imgBack)
      card.imgBack = req.body.imgBack;

    if (req.body.playerName)
      card.playerName = req.body.playerName;

    if (req.body.year)
      card.year = req.body.year;

    if (req.body.manufacturer)
      card.manufacturer = req.body.manufacturer;

    if (req.body.cardNum)
      card.cardNum = req.body.cardNum;

    if (req.body.team)
      card.team = req.body.team;

    if (req.body.collectionInfo)
      card.collectionInfo = req.body.collectionInfo;

    if (req.body.otherInfo)
      card.otherInfo = req.body.otherInfo;

    if (req.body.quantity)
      card.quantity = req.body.quantity;

    if (req.body.sold)
      card.sold = req.body.sold;

    if (req.body.display)
      card.display = req.body.display;


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
