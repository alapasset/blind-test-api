import express, { Request, Response } from "express"
import { PlaylistController } from "../controller/playlist"
import { SalonController } from "../controller/salon"

class Routes {

  private playlistController: PlaylistController
  private salonController: SalonController

  constructor() {
    this.salonController = new SalonController()
    this.playlistController = new PlaylistController()
  }

  public routes(app: express.Application): void {
    app.route('/')
      .get((request: Request, response: Response) => {
        response.status(200).send({ message: "GET request successfully." })
      })

    app.route('/playlist')
      .get(this.playlistController.getAllPlaylist)
      .post(this.playlistController.createPlaylist)

    app.route('/playlist/:playlistId')
      .get(this.playlistController.getPlaylistById)
      .put(this.playlistController.updatePlaylist)

      app.route('/playlist/:playlistId/tracks')
      .get(this.playlistController.getTracksByPlaylistById)

    app.route('/salon')
      .get(this.salonController.getAllSalon)
      .post(this.salonController.createSalon)

    app.route('/salon/:salonId')
      .get(this.salonController.getSalonById)
      .put(this.salonController.updateSalon)

    app.route('/salon/:salonId/playlist')
      .get(this.salonController.getPlaylistBySalonId)
  }
}

export { Routes }

