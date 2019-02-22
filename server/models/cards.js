/* This is only a work in progress and will likely change as the project starts moving along more */
/* I assume we are going to use mongoose like we learned from the bootcamp assignments */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sportsCardSchema = new Schema (
{
    imgFront: String, //image path url
    imgBack: String, //image path url
    playerName: String,
    year: Date,
    manufacturer: String,
    cardNum: Number,
    team: String,
    collectionInfo: [String], //Haven't tested this yet
    otherInfo: String,
    quantity: Number,
    sold: Boolean,
    created_at: Date,
    updated_at: Date,
    display: Boolean
});

sportsCardSchema.pre('save', function(next)
{
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
});

var Card = mongoose.model('Card', sportsCardSchema);

module.exports = Card;