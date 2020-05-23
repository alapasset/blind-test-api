import { Column, Entity, PrimaryColumn, Connection } from "typeorm"

@Entity()
export class Artist {
  @PrimaryColumn()
  public id: string

  @Column()
  public name: string

  @Column()
  public url: string

  static async updateArtists(artists: [], connection: Connection): Promise<Artist[]> {
    let artistsRes : Artist[] = []
    artists.forEach(async (artistToAdd: any) => {
      let artist = new Artist()
      artist.id = artistToAdd.id
      artist.name = artistToAdd.name
      artist.url = artistToAdd.external_urls.spotify
      await connection.manager.save(artist)
      artistsRes.push(artist)
    })
    return artistsRes
  }
}

export default Artist
