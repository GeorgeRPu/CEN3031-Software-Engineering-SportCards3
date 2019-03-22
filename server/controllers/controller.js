var mongoose = require('mongoose'),
    Card = require('../models/cards.js'),
    fs = require('fs');

const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = './server/controllers/token.json';

//Associates an image with a card, for now the images are stored in the filesystem
exports.addImage = function(req, res)
{
  var card = new Card(req.body);
  card.imgFront = req.files['front'][0].filename;
  card.imgBack = req.files['back'][0].filename;

  var front = card.imgFront;
  var back = card.imgBack;
  var tempFront;
  var tempBack;

  var fileMetadataFront = {
    'name': front,
    'parents':['1eRmiQxN-BXdd7fjDXP3Umrybka4f3vFf']
  };
  var mediaFront = {
    mimeType: 'image/png',
    body: fs.createReadStream('./client/images/' + front)
  };
  var fileMetadataBack = {
    'name': back,
    'parents':['1eRmiQxN-BXdd7fjDXP3Umrybka4f3vFf']
  };
  var mediaBack = {
    mimeType: 'image/png',
    body: fs.createReadStream('./client/images/' + back)
  };

  fs.readFile('./server/controllers/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.

    authorize(JSON.parse(content), uploadFile);
  });
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) console.log("Cannot find token, run setup-drive to generate.");
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client, saveCard);
    });
  }

  var uploaded1 = false;
  var uploaded2 = false;
  function uploadFile(auth, callback) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.create({
      resource: fileMetadataFront,
      media: mediaFront,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.data.id);
        card.imgFront = file.data.id;
        uploaded1 = true;
        if(uploaded1 && uploaded2){
          saveCard();
        }
      }
    });
    drive.files.create({
      resource: fileMetadataBack,
      media: mediaBack,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.data.id);
        card.imgBack = file.data.id;
        uploaded2 = true;
        if(uploaded1 && uploaded2){
          saveCard();
        }
      }
    });
  };
  function saveCard(){
    card.save(function(err) {
      console.log("saving");
      if(err) {
        console.log(err);
        res.status(400).send(err);
      };
    });
  }
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
