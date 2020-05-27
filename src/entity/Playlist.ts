import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm"
import Track from "./Track"

@Entity()
export class Playlist {
  @PrimaryColumn()
  public id: string

  @Column()
  public name: string

  @UpdateDateColumn()
  public lastUpdate: Date

  @ManyToMany(() => Track, (track) => track.playlists)
  @JoinTable()
  tracks: Track[]
}

export default Playlist
