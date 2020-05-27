import { Request, Response } from 'express'
import { connection } from "../connection/Connection"
import Playlist from "../entity/Playlist"
import Track from '../entity/Track'


class PlaylistController {

  public getAllPlaylist(req: Request, res: Response) {
    connection.then(async connection => {
      const playlists: Playlist[] = await connection.manager.find(Playlist,{
        select: ["id", "name"]
      })
      res.json(playlists)
    })
    .catch(error => {
      console.error("Error ", error)
      res.json(error)
    })
  }

  public getPlaylistById(req: Request, res: Response) {
    connection
      .then(async connection => {
        let playlist = await connection.manager.findOne(Playlist, { id: req.params.playlistId }, {
          join: {
            alias: "playlist",
            leftJoinAndSelect: {
              track: "playlist.tracks",
              artist: "track.artists"
            }
          }
        })
        res.json(playlist)
      })
      .catch(error => {
        console.error("Error ", error)
        res.json(error)
      })
  }

  public getTracksByPlaylistById(req: Request, res: Response) {
    connection
      .then(async connection => {
        let tracks =  await connection.manager.getRepository(Track).createQueryBuilder('track')
        .innerJoinAndSelect('track.artists', 'artists')
        .leftJoin('track.playlists', 'playlists')
        .where('playlists.id = :id', { id: req.params.playlistId }).getMany()
        res.json(tracks)
      })
      .catch(error => {
        console.error("Error ", error)
        res.json(error)
      })
  }

  public createPlaylist(req: Request, res: Response) {
    connection.then(async connection => {
      let playlist = new Playlist()
      playlist.id = req.body.id
      playlist.name = req.body.name
      playlist.tracks = await Track.createTracks(req.body.tracks.items, connection)
      res.json(await connection.manager.save(playlist))
    })
    .catch(error => {
      console.error("Error ", error)
      res.json(error);
    })
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
}

export { PlaylistController }

