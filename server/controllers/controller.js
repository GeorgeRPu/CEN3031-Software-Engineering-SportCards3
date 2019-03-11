var mongoose = require('mongoose'),
    Card = require('../models/cards.js');

//Associates an image with a card, for now the images are stored in the filesystem
exports.addImage = function(req, res)
{
  var card = new Card(req.body);
  card.imgFront = req.files['front'][0].filename;
  card.imgBack = req.files['back'][0].filename;

  card.save(function(err) {
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

  Card.findOneAndRemove({'_id': card.id}, function(err)
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
      data.sort('playerName');
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
