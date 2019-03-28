var mongoose = require('mongoose'),
    Card = require('../models/cards.js'),
    fs = require('fs');

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'sports-cards-test',
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const bucketName = 'sport-cards-bucket';
const bucket = storage.bucket(bucketName);

//uploads images to google cloud, saves new card
exports.addImage = async function(req, res)
{
  var card = new Card(req.body);
  card.imgFront = req.files['front'][0].filename;
  card.imgBack = req.files['back'][0].filename;
  var path = './client/images/';
  var front = card.imgFront;
  var back = card.imgBack;

  await bucket.upload(path + front, {});
  await bucket.upload(path + back, {});

  fs.unlink(path + front);
  fs.unlink(path + back);

  card.save(function(err) {
    console.log("saving");
    if(err) {
      console.log(err);
      res.status(400).send(err);
    };
  });
};
/* Create */
exports.create = function(req, res)
{

  var card = new Card(req.body);

  card.save(function(err)
  {
    if(err)
    {
      console.log(err);
      res.status(400).send(err);
    }
    else
    {
      res.json(card);
    }
  });
};

/* Read */
exports.read = function(req, res)
{
  res.json(req.card);
};

/* Update */
exports.update = function(req, res)
{
  var card = req.card;

  card.imgFront = req.body.imgFront;
  card.imgBack = req.body.imgBack;
  card.playerName = req.body.playerName;
  card.year = req.body.year;
  card.manufacturer = req.body.manufacturer;
  card.cardNum = req.body.cardNum;
  card.team = req.body.team;
  card.collectionInfo = req.body.collectionInfo;
  card.otherInfo = req.body.otherInfo;
  card.quantity = req.body.quantity;
  card.sold = req.body.sold;
  card.display = req.body.display;
  card.updated_at = new Date();

  card.save(function(err)
  {
    if(err)
    {
      console.log(err);
      res.status(400).send(err);
    }
    else
    {
      res.json(card);
    }
  });
};

/* Delete */
exports.delete = function(req, res) {
  var card = req.card;

  bucket.file(card.imgFront).delete();
  bucket.file(card.imgBack).delete();

  Card.findOneAndRemove({'_id': card._id}, function(err)
  {
    if(err)
    {
      console.log(err);
      res.status(400).send(err);
    }
    else
    {
      res.end();
    }
  })
};

/* Sort by playerName */
//Will add more sorting functions later for other categories
exports.list = function(req, res)
{
  Card.find({}, function(err, data)
  {
    if(err)
    {
      console.log(err);
      res.status(400).send(err);
    }
    else
    {
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

exports.cardByID = function(req, res, next, id)
{
  Card.findById(id).exec(function(err, card)
  {
    if(err)
    {
      res.status(400).send(err);
    }
    else
    {
      req.card = card;
      next();
    }
  });
};
