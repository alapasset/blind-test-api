import { Request, Response } from "express"
import express from "express"
import { Controller } from "../controller/Controller"

class Routes {

  private controller: Controller

  constructor() {
    this.controller = new Controller()
  }

  public routes(app: express.Application): void {
    app.route('/')
      .get((request: Request, response: Response) => {
        response.status(200).send({ message: "GET request successfully." })
      })

    app.route('/spotify/callback')
      .get(this.controller.spotifyCallback)

    app.route('/spotify/authUrl')
      .get(this.controller.spotifyAuthUrl)

    app.route('/spotify/me')
      .get(this.controller.spotifyMe)

    app.route('/spotify/playlist/:playlistId')
      .get(this.controller.getSpotifyPlaylistInformations)

    app.route('/playlist')
      .get(this.controller.getAllPlaylist)
      .post(this.controller.addPlaylist)

    app.route('/playlist/:playlistId')
      .get(this.controller.getPlaylistById)
      .put(this.controller.updatePlaylist)
  }
}

export {Routes}
