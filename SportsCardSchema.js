/* This is only a work in progress and will likely change as the project starts moving along more */
/* I assume we are going to use mongoose like we learned from the bootcamp assignments */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sportsCardSchema = new Schema (
{
    //imgFront: { data: Buffer, contentType: String }, //Placeholder, not functional yet. Not sure yet how we will handle images.
    //imgBack: { data: Buffer, contentType: String },
    playerName: String,
    year: Date,
    manufacturer: String,
    cardNum: Number,
    team: String,
    //collectionInfo: //"any special collection information (tags, [strings])" What data type is this? String array?
    otherInfo: String,
    sold: Boolean
});

var Card = mongoose.model('Card', sportsCardSchema);

module.exports = Card;
