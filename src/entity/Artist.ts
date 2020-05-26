import { Column, Connection, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Artist {
  @PrimaryColumn()
  public id: string

  @Column()
  public name: string

  @Column()
  public url: string

  static async createArtists(artists: [], connection: Connection): Promise<Artist[]> {
    return new Promise(async (resolve, reject) => {
      let artistsRes : Artist[] = []
      artists.forEach(async (artistToAdd: any) => {
        try {
          let artist = new Artist()
          artist.id = artistToAdd.id
          artist.name = artistToAdd.name
          artist.url = artistToAdd.external_urls.spotify
          await connection.manager.save(artist)
          artistsRes.push(artist)
        } catch (e) {
          console.log(e)
          reject()
        }
      })
      resolve(artistsRes)
    })
  }
}

export default Artist
