const querystring = require('querystring');
var request = require('request');

//SPOTIFY variables
const CLIENT_ID = 'f80117db049c42f18beba3911fe96479';
const CLIENT_SECRET = 'e9c4343b58484480ae6a8a1d122f12f6'; // APP Spotify BlindTest Secret API Key
const REDIRECT_URI = 'https://blinder-test-api.herokuapp.com/callback'; // Redirect uri, once login is completed
//const REDIRECT_URI = 'http://localhost:8080/callback'; // Redirect uri, once login is completed
var ACCES_TOKEN = '';
var REFRESH_TOKEN = '';

const login = (req, res) => {
  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      show_dialog: false
    })
  );
}

const callback = (req, res) => {
  const authCode = req.query.code || null;

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
      res.redirect('/user-info');
    } else {
      res.redirect( '/#' + querystring.stringify({error: 'invalid_token'}) );
    }
  });

}

const getUserInfos = (req, res) => {
	const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: `Bearer ${ACCES_TOKEN}` },
    json: true
    };
  
    request.get(options, function(error, reponse, body) {
      res.send(body);
    });
}

const getAllPlaylistsFromUser = (req, res) => {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { Authorization: `Bearer ${ACCES_TOKEN}` },
    json: true
  };

  request.get(options, function(error, reponse, body) {
    res.send(body);
  });
}

const getPlaylist = (req, res) => {
  const options = {
    url: `https://api.spotify.com/v1/playlists/${req.params.id}`,
    headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
    json: true
  };

  request.get(options, function(error, reponse, body) {
    res.send(body);
  });
}

module.exports = {
  login,
  callback,
  getUserInfos,
  getAllPlaylistsFromUser,
  getPlaylist,
}