var express = require('express');
var router = express.Router();

var request = require('request')
var config = require('../config');

/* GET */
router.get('/', async function (req, res, next) {
  const lyrics = req.query.lyrics;
  if (!lyrics) return res.render('textSearch', { title: 'Text Search - The Milk' });

  const data = {
    'return': 'timecode,apple_music,deezer,spotify',
    'api_token': config.audd_api_token,
    'method': 'findLyrics',
    'q': lyrics
  };
  
  request({
    uri: 'https://api.audd.io/',
    form: data,
    method: 'POST'
  }, async function (err, resApi, body) {
    var data = JSON.parse(body);

    // ссылки на песни не работают сейчас :(
      
    // console.log(data.result.length);

    // await data.result.forEach(async (song, index, object) => {
    //   const artist = song.artist;
    //   const track = song.title;
    //   await request(`https://api.deezer.com/search?q=artist:"${artist}"track:"${track}"`, function (err, resApi, body) {
    //     var deezerData = "";
    //     try {
    //       deezerData = JSON.parse(body);
    //     }
    //     catch (e) { }

    //     if(!deezerData.total || deezerData.total <= 0) data.result.splice(index, 1);
    //   });
    // });

    // console.log(data.result.length);

    res.render('textSearch', { title: 'Text Search - The Milk', data: data.result });
  });

});

module.exports = router;
