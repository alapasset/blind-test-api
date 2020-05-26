import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import { Routes } from "./routes/Routes"

class App {
  public application: express.Application

  public routePrv: Routes

  constructor() {

    this.application = express()

    // support application/json type post data
    this.application.use(bodyParser.json({limit: '10mb'}))
    this.application.use(cors())

    //support application/x-www-form-urlencoded post data
    this.application.use(bodyParser.urlencoded({ extended: false }))

    this.routePrv = new Routes()
    this.routePrv.routes(this.application)
  }
}

export default new App().application

