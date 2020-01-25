var express = require('express');
var router = express.Router();
const stream = require('streamifier');

var request = require('request')
var config = require('../config');

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
router.post('/search', (req, res) => {
    const file = req.files.audio_data;
    //console.log(file);
    
    const data = {
        'file': stream.createReadStream(file.data)
        //'return': 'deezer',
        //'api_token': config.audd_api_token
    };
    request({
        uri: 'https://api.audd.io/',
        api_token: config.audd_api_token,
        formData: data,
        method: 'POST'
    }, function (err, resApi, body) {
        const data = JSON.parse(body);
        console.log(data);
        res.send(data.result);
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
