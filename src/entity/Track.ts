import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable, Connection } from "typeorm"
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

  static async updateTracks(tracks: any[], connection: Connection): Promise<Track[]> {
    let tracksRes : Track[] = []
    tracks.forEach(async (item: any) => {
      if (item.track.preview_url) {
        let track = new Track()
        track.id = item.track.id
        track.title = item.track.name
        track.image = item.track.album.images[1].url
        track.preview_url = item.track.preview_url
        track.url = item.track.external_urls.spotify
        track.artists = await Artist.updateArtists(item.track.album.artists, connection)
        await connection.manager.save(track)
        tracksRes.push(track)
      }
    })
    return tracksRes
  }
}

export default Track
