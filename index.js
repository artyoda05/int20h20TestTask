const express = require('express');
const path = require('path');
const parser = require('busboy-body-parser');
const request = require('request');
const config = require('./config');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/textSearch', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/textSearch.html'));
});

app.get('/voiceSearch', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/voiceSearch.html'));
});

//GET /search?lyrics=:lyrics
// finds possible track names and artists by part of lyrics 
app.get('/search', (req, res) => {
    const lyrics = req.query.lyrics;
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
    }, function (err, resApi, body) {
        const data = JSON.parse(body);
        console.log(data);
        res.send(data.result);
    });
});

//GET /searchDeezer?artist=:artist&song=:song
//finds song info on Deezer by its artist and name
app.get('/searchDeezer', (req, res) => {
    const artist = req.query.artist;
    const song = req.query.song;
    request(`https://api.deezer.com/search?q=artist:"${artist}"track:"${song}"`, function (err, resApi, body) {
        const data = JSON.parse(body);
        res.send(data);
    });
});

app.listen(config.port, () => console.log(`Started on ${config.port}`));