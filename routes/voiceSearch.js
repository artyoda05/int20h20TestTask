var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var request = require('request')
var config = require('../config');
const bodyParser = require('busboy-body-parser');
router.use(bodyParser());
/* GET */
router.get('/', function(req, res, next) {
  res.render('voiceSearch', { title: 'Voice Search - The Milk' });
});

router.post('/', async (req, res) => {
  const file = req.files.audio_data;
  //console.log(file);
  fs.writeFileSync( path.join(__dirname, `../temporary/${file.name}`), file.data);
  
  var data = {
      'file': fs.createReadStream(path.join(__dirname, `../temporary/${file.name}`)),
      'return': 'deezer',
      'api_token': config.audd_api_token
  };
  
  request({
      uri: 'https://api.audd.io/',
      formData: data,
      method: 'POST'
    }, function (err, result, body) {
      let data = JSON.parse(body);
      if (data.result !== null)
          data.result.deezerData = [data.result.deezer];
      res.render('result', { title: 'Voice Search - The Milk', data: [data.result] });
      fs.unlink(path.join(__dirname, `../temporary/${file.name}`), (err) => console.log(err));
    });
});

module.exports = router;
