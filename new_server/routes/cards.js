var cardsController = require('../controllers/cards');
var express = require('express');
var router = express.Router();

router.route('/').get(cardsController.list);

router.route('/:cardId')
  .get(cardsController.read)
  .put(cardsController.update)
  .delete(cardsController.delete);

router.param('cardId', cardsController.cardByID);

module.exports = router;
