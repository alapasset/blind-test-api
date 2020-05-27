import { Request, Response } from 'express'
import { connection } from "../connection/Connection"
import Playlist from '../entity/Playlist'
import Salon from '../entity/Salon'

class SalonController {

  public getAllSalon(req: Request, res: Response) {
    connection.then(async connection => {
      const salons: Salon[] = await connection.getRepository(Salon).find({
        select: ["id", "name"]
      })
      res.json(salons)
    })
    .catch(error => {
      console.error("Error ", error)
      res.json(error)
    })
  }

  public getSalonById(req: Request, res: Response) {
    connection
      .then(async connection => {
        let salon = await connection.manager.getRepository(Salon).findOne(req.params.salonId, {
          join: {
            alias: "salon",
            leftJoinAndSelect: {
              playlist: "salon.playlist",
            }
          }
        })
        res.json(salon)
      })
      .catch(error => {
        console.error("Error ", error)
        res.json(error)
      })
  }
  public getPlaylistBySalonId(req: Request, res: Response) {
    connection
      .then(async connection => {
        let salon = await connection.manager.getRepository(Playlist).findOne(req.params.salonId, {
          join: {
            alias: "salon",
            leftJoinAndSelect: {
              playlist: "salon.playlist",
            }
          }
        })
        res.json(salon)
      })
      .catch(error => {
        console.error("Error ", error)
        res.json(error)
      })
  }

  public createSalon(req: Request, res: Response) {
    connection.then(async connection => {
      let salon = new Salon()
      salon.name = req.body.name
      salon.playlist = await connection.manager.getRepository(Playlist).findOne(req.body.playlistId)
      res.json(await connection.manager.save(salon))
    })
    .catch(error => {
      console.error("Error ", error)
      res.json(error);
    })
  }

  public updateSalon(req: Request, res: Response) {
    connection
      .then(async connection => {
        let salon = await connection.manager.findOne(Salon, req.params.salonId)
        salon.name = req.body.name
        salon.playlist = await connection.manager.getRepository(Playlist).findOne(req.body.playlistId)
        await connection.manager.save(salon)
        res.json({message: "Successfully Updated."})
      })
      .catch(error => {
        console.error("Error ", error)
        res.json(error)
      })
  }
}

export { SalonController }

