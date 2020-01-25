var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');
var config = require('../config');

/* GET */
router.get('/', async function (req, res, next) {
  const lyrics = req.query.lyrics;
  if (!lyrics) return res.render('textSearch', { title: 'Text Search - The Milk' });

  const formData = {
    'return': 'timecode,apple_music,deezer,spotify',
    'api_token': config.audd_api_token,
    'method': 'findLyrics',
    'q': lyrics
  };

  var results = await fetch("https://api.audd.io/", {body: JSON.stringify(formData), method: 'POST'});
  var data = await results.json();

  for(let i = 0; i < data.result.length; i++){
    const artist = data.result[i].artist;
    const track = data.result[i].title;
    
    var deezerData;
    try {
      const response = await fetch(`https://api.deezer.com/search?q=artist:"${artist}"track:"${track}"`);
      deezerData = await response.json();
    }
    catch(e){}
    
    if(!deezerData || !deezerData.total || deezerData.total <= 0) data.result.splice(i, 1);
    if(data.result[i] && deezerData) data.result[i].deezerData = deezerData.data;
  }
  res.render('textSearch', { title: 'Text Search - The Milk', data: data.result });
});

module.exports = router;
