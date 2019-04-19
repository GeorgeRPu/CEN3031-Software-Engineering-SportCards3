var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
  imgFront: String,
  imgBack: String,
  playerName: String,
  year: Number,
  manufacturer: String,
  cardNum: Number,
  team: String,
  otherInfo: [String],
  quantity: Number,
  sold: Boolean,
  created_at: Date,
  updated_at: Date,
  display: Boolean
});

cardSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if (!this.created_at) {
    this.created_at = currentTime;
  }
  next();
});

var Card = mongoose.model('Card', cardSchema);

module.exports = Card;
