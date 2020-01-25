var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
  res.render('textSearch', { title: 'Text Search - The Milk' });
});

module.exports = router;
