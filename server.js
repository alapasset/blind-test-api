// Server-side of Spotify BlindTest Application

// Libraries :
const express = require('express')
const user = require('./user.queries') 
const spotify = require('./spotify.queries') 
const cors = require('cors')

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8081

const app = express()

app.use(cors())

app.get('/playlist/:id/tracks', spotify.getAllTracksFromAPlaylist)
app.put('/playlist/:id', spotify.putPlaylistInformations)

app.get('/users', user.get)
app.get('/users/:id', user.getById)
app.post('/users', user.create)
app.put('/users/:id', user.update)
app.delete('/users/:id', user.unactivate)

app.listen(PORT, function() {
  console.log(`Our app is running on http://localhost: ${PORT}`)
})