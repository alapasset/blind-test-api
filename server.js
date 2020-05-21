// Server-side of Spotify BlindTest Application

// Libraries :
var express = require('express');
var querystring = require('querystring');
var request = require('request');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

//SPOTIFY variables
var CLIENT_ID = 'f80117db049c42f18beba3911fe96479';
var CLIENT_SECRET = 'ca7218fdaed34ba3b7217837cce1bcb1'; // APP Spotify BlindTest Secret API Key
var REDIRECT_URI = 'https://blinder-test-api.herokuapp.com/callback'; // Redirect uri, once login is completed
var ACCES_TOKEN = '';
var REFRESH_TOKEN = '';
var USER_ID = '';

var app = express();

app.get('/', function(req, res) {
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
    headers: { Authorization: `Basic ${new Buffer(CLIENT_ID + ':' + CLIENT_SECRET)}`.toString('base64') },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      ACCES_TOKEN = body.access_token;
      REFRESH_TOKEN = body.refresh_token;
      res.redirect('/user-info');
    } else {
      res.redirect( '/#' + querystring.stringify({error: 'invalid_token'}) );
    }
  });
});


app.get('/user-info', function(req, res) {
	var options = {
	url: 'https://api.spotify.com/v1/me',
  headers: { Authorization: `Bearer ${ACCES_TOKEN}` },
	json: true
	};

	request.get(options, function(error, response, body) {
      res.send(body);
  });

});

app.get('/playlists', function(req, res) {
  // Options of the GET request : (LIMIT=50 here)
  var options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { Authorization: `Bearer ${ACCES_TOKEN}` },
    json: true
  };

  request.get(options, function(error, response, body) {
    res.send(body);
  });
});

app.get('/playlist/:id', function(req, res) {
  var options = {
    url: `https://api.spotify.com/v1/playlists/${req.params.id}`,
    headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
    json: true
  };

  request.get(options, function(error, response, body) {
    res.send(body);
  });
});

app.listen(port, function() {
  console.log(`Our app is running on http://localhost: ${port}`);
});