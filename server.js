// Server-side of Spotify BlindTest Application

// Libraries :
var express = require('express');
var querystring = require('querystring');
var request = require('request');

var CLIENT_ID = 'f80117db049c42f18beba3911fe96479';
var CLIENT_SECRET = 'ca7218fdaed34ba3b7217837cce1bcb1'; // APP Spotify BlindTest Secret API Key
var REDIRECT_URI = 'http://localhost:8888/callback'; // Redirect uri, once login is completed

var ACCES_TOKEN = '';
var REFRESH_TOKEN = '';
var USER_ID = '';

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res) {
  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      show_dialog: false
    })
  );

});

app.get('/callback', function(req, res) {
  var authCode = req.query.code || null;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: authCode,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      ACCES_TOKEN = body.access_token;
      REFRESH_TOKEN = body.refresh_token;
      console.log("Successfully Logged!")
      console.log(body)
    } else {
      res.redirect( '/#' + querystring.stringify({error: 'invalid_token'}) );
    }
  });
});


app.get('/user-info', function(req, res) {
	var options = {
	url: 'https://api.spotify.com/v1/me',
	headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
	json: true
	};

	request.get(options, function(error, response, body) {
      console.log('GET USER INFOS ');
      console.log('=========================');
      console.log(body);
      console.log('=========================');
      res.send(body);
  });

});

app.get('/playlists', function(req, res) {
  // Options of the GET request : (LIMIT=50 here)
  var options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
    json: true
  };

  request.get(options, function(error, response, body) {
    console.log('GET ALL PLAYLISTS FROM USER ' + USER_ID);
    console.log('=========================');
    console.log(body);
    console.log('=========================');
    res.send(body);
  });
});

console.log('Listening on 8888');
app.listen(8888);