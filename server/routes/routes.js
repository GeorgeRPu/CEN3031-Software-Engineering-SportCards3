var cards = require('../controller.js'),
    express = require('express'),
    router = express.Router();

router.route('/')
  .get(cards.list)
  .post(cards.create);

router.route('/:cardId')
  .get(cards.read)
  .put(cards.update)
  .delete(cards.delete);

router.param('cardId', cards.cardByID);

module.exports = router;
