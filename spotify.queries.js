var SpotifyWebApi = require('spotify-web-api-node')
const db = require('./db')

var accessTokenEpoch = 0

var spotifyApi = new SpotifyWebApi({
  clientId: 'f80117db049c42f18beba3911fe96479',
  clientSecret: 'e9c4343b58484480ae6a8a1d122f12f6',
})

const checkAccessToken = () => {
  return new Promise(async (resolve, reject) => {
    if (Date.now() > (accessTokenEpoch - 300)) {
      try {
        const data = await spotifyApi.clientCredentialsGrant()
        accessTokenEpoch = Date.now() + data.body.expires_in
        spotifyApi.setAccessToken(data.body.access_token)
        resolve()
      } catch (error) {
        reject()
      } 
    } else {
      resolve() 
    }
  })  
}

const getAllTracksFromAPlaylist = async (req, res) => {
  try {
    await checkAccessToken()
  } catch (error) {
    console.log(`Error lors de l'obtention de l'access token`, error)
  }
  try {
    res.send(await spotifyApi.getPlaylist(req.params.id))
  } catch (error) {
    console.log(`Error lors de l'obtention des chansons de la playlist ${req.params.id}`, error)
  }
}

const putPlaylistInformations = async (req, res) => {
  try {
    await checkAccessToken()
  } catch (error) {
    console.log(`Error lors de l'obtention de l'access token`, error)
  }
  try {
    updatePlaylistInformations(await spotifyApi.getPlaylist(req.params.id))
    res.status(201).send(`Playlist ID: ${req.params.id} is up to date`)
  } catch (error) {
    console.log(`Error lors de la mise à jours des informations de la playlist ${req.params.id}`, error)
  }
}

const updatePlaylistInformations = async (playlist) => {
  await db.query('INSERT INTO playlist (id, name, last_update) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = $2, last_update = $3', [playlist.body.id, playlist.body.name, new Date().toISOString()])
  playlist.body.tracks.items.forEach(async (item) => {
    if (item.track.preview_url) {
      await db.query('INSERT INTO track (id, title, preview_url, url, image) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING', [item.track.id, item.track.name, item.track.preview_url, item.track.external_urls.spotify, item.track.album.images[1]])
      await db.query('INSERT INTO track_playlist (playlist_id, track_id) VALUES ($1, $2) ON CONFLICT (playlist_id, track_id) DO NOTHING', [playlist.body.id, item.track.id])
      item.track.album.artists.forEach(async (artist) => {
        await db.query('INSERT INTO artist (id, name, url) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING', [artist.id, artist.name, artist.external_urls.spotify])
        await db.query('INSERT INTO artist_track (track_id, artist_id) VALUES ($1, $2) ON CONFLICT (track_id, artist_id) DO NOTHING', [item.track.id, artist.id])
      })
    }
  })
}

module.exports = {
  getAllTracksFromAPlaylist,
  putPlaylistInformations
}