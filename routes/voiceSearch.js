var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
  res.render('voiceSearch', { title: 'Voice Search - The Milk' });
});

module.exports = router;
