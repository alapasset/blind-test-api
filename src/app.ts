import express from "express"
import bodyParser from "body-parser"
import { Routes } from "./routes/Routes"
import { SpotifyService } from "./service/spotify"

class App {
  public application: express.Application

  public routePrv: Routes

  public spotifyService: SpotifyService

  constructor() {

    this.application = express()

    // support application/json type post data
    this.application.use(bodyParser.json())

    //support application/x-www-form-urlencoded post data
    this.application.use(bodyParser.urlencoded({ extended: false }))

    this.routePrv = new Routes()
    this.routePrv.routes(this.application)
  }
}

export default new App().application

