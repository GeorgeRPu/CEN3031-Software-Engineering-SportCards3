var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sportsCardSchema = new Schema (
{
    imgFront: String, //stores the unique filename for now, images are currently stored in the filesystem. To be updated later.
    imgBack: String,
    playerName: String,
    year: Date,
    manufacturer: String,
    cardNum: Number,
    team: String,
    collectionInfo: [String],
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
