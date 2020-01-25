var express = require('express');
var router = express.Router();
const stream = require('streamifier');
const fs = require('fs');
const path = require('path');

var request = require('request')
var config = require('../config');
const bodyParser = require('busboy-body-parser');
router.use(bodyParser());

// GET /search?lyrics=:lyrics
// finds possible track names and artists by part of lyrics 
router.get('/search', (req, res) => {
    const lyrics = req.query.lyrics;
    const data = {
        'api_token': config.audd_api_token,
        'method': 'findLyrics',
        'q': lyrics
    };
    request({
        uri: 'https://api.audd.io/',
        form: data,
        method: 'POST'
    }, function (err, resApi, body) {
        const data = JSON.parse(body);
        res.send(data.result);
    });
});

// POST /search
// finds possible track names and artists by sample file
router.post('/search', async (req, res) => {
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
        const data = JSON.parse(body);
        res.send(data.result);
        fs.unlink(path.join(__dirname, `../temporary/${file.name}`), (err) => console.log(err));
      });
});

//GET /searchDeezer?artist=:artist&song=:song
//finds song info on Deezer by its artist and name
router.get('/searchDeezer', (req, res) => {
    const artist = req.query.artist;
    const song = req.query.song;
    request(`https://api.deezer.com/search?q=artist:"${artist}"track:"${song}"`, function (err, resApi, body) {
        const data = JSON.parse(body);
        res.send(data);
    });
});

module.exports = router;
