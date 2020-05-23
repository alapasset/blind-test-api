import { Request, Response } from 'express'
import { connection } from "../connection/Connection"
import { SpotifyService } from "../service/spotify"
import Playlist from "../entity/Playlist"
import Track from '../entity/Track'

class Controller {

  constructor() {}

  public getAllPlaylist(req: Request, res: Response) {
    connection.then(async connection => {
      const playlists: Playlist[] = await connection.manager.find(Playlist, {
        join: {
          alias: "playlist",
          leftJoinAndSelect: {
            track: "playlist.tracks",
            artist: "track.artists"
          }
        }
      })
      res.json(playlists)
    })
    .catch(error => {
      console.error("Error ", error)
      res.json(error)
    })
  }

  public async getSpotifyPlaylistInformations(req: Request, res: Response) {
    // const spotifyService = new SpotifyService()
    // res.json(await spotifyService.getPlaylistTracksInformations(req.params.playlistId))
  }

  public addPlaylist(req: Request, res: Response) {
    // connection.then(async connection => {
    //   const spotifyService = new SpotifyService()
    //   let playlistToAdd = await spotifyService.getPlaylistInformations(req.body.playlistId)
    //   let playlist = new Playlist()
    //   playlist.id = playlistToAdd.body.id
    //   playlist.name = playlistToAdd.body.name
    //   playlist.tracks = await Track.updateTracks(playlistToAdd.body.tracks.items, connection)
    //   await connection.manager.save(playlist)
    //   res.json({message: "Successfully Saved."})
    // })
    // .catch(error => {
    //   console.error("Error ", error)
    //   res.json(error);
    // })
  }

  public updatePlaylist(req: Request, res: Response) {
    connection
      .then(async connection => {
        let playlist = await connection.manager.findOne(Playlist, req.params.playlistId)
        let requestPlaylist = req.body
        playlist.name = requestPlaylist.name
        await connection.manager.save(playlist)
        res.json({message: "Successfully Updated."})
      })
      .catch(error => {
        console.error("Error ", error)
        res.json(error)
      })
  }

  public getPlaylistById(req: Request, res: Response) {
    connection
      .then(async connection => {
        let playlist = await connection.manager.findOne(Playlist, req.params.playlistId)
        res.json(playlist)
      })
      .catch(error => {
        console.error("Error ", error)
        res.json(error)
      })
  }

  public async spotifyCallback(req: Request, res: Response) {
    const spotifyService = SpotifyService.getInstance()
    await spotifyService.setCode(req.query.code.toString())
    res.redirect('/spotify/me')
  }

  public spotifyAuthUrl(req: Request, res: Response) {
    res.redirect(SpotifyService.getAuthUrl())
  }

  public async spotifyMe(req: Request, res: Response) {
    const spotifyService = SpotifyService.getInstance()
    res.json(await spotifyService.getMyInformations())
  }
}

export {Controller}
