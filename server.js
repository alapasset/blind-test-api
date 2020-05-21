// Server-side of Spotify BlindTest Application

// Libraries :
const express = require('express');
const user = require('./user.queries') 
const spotify = require('./spotify.queries') 

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

const app = express();

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/login', spotify.login);
app.get('/callback', spotify.callback);
app.get('/user-info', spotify.getUserInfos);
app.get('/playlists', spotify.getAllPlaylistsFromUser);
app.get('/playlist/:id', spotify.getPlaylist);

app.get('/users', user.get)
app.get('/users/:id', user.getById)
app.post('/users', user.create)
app.put('/users/:id', user.update)
app.delete('/users/:id', user.unactivate)

app.listen(port, function() {
  console.log(`Our app is running on http://localhost: ${port}`);
});