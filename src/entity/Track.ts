import { Column, Connection, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"
import Artist from "./Artist"
import Playlist from "./Playlist"

@Entity()
export class Track {
  @PrimaryColumn()
  public id: string

  @Column()
  public title: string

  @Column()
  public preview_url: string

  @Column()
  public url: string

  @Column()
  public image: string

  @ManyToMany(type => Artist)
  @JoinTable()
  artists: Artist[]

  @ManyToMany(type => Playlist, playlist => playlist.id)
  playlist: Playlist[]

  static async createTracks(tracks: any[], connection: Connection): Promise<Track[]> {
    return new Promise(async (resolve, reject) => {
      let tracksRes : Track[] = []
      tracks.forEach(async (item: any) => {
        if (item.track.preview_url) {
          try {
            let track = new Track()
            track.id = item.track.id
            track.title = item.track.name
            track.image = item.track.album.images[1].url
            track.preview_url = item.track.preview_url
            track.url = item.track.external_urls.spotify
            track.artists = await Artist.createArtists(item.track.album.artists, connection)
            await connection.manager.save(track)
            tracksRes.push(track)
          } catch (e) {
            console.log(e)
            reject()
          }
        }
      })
      resolve(tracksRes)
    })
  }
}

export default Track
