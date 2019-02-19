/* This is only a work in progress and will likely change as the project starts moving along more */
/* I assume we are going to use mongoose like we learned from the bootcamp assignments */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sportsCardSchema = new Schema (
{
    imgFront: String, //If images are stored in the filesystem, this should be the path to the image
    imgBack: String, //Storing images themselves on mongoDB seems inefficient
    playerName: String,
    year: Date,
    manufacturer: String,
    cardNum: Number,
    team: String,
    //collectionInfo: //"any special collection information (tags, [strings])" What data type is this? String array?
    otherInfo: String,
    quantity: Number,
    sold: Boolean
});

var Card = mongoose.model('Card', sportsCardSchema);

module.exports = Card;
