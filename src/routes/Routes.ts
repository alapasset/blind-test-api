import express, { Request, Response } from "express"
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

    app.route('/playlist')
      .get(this.controller.getAllPlaylist)
      .post(this.controller.createPlaylist)

    app.route('/playlist/:playlistId')
      .get(this.controller.getPlaylistById)
      .put(this.controller.updatePlaylist)
  }
}

export { Routes }

