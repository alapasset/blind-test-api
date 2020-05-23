import { Column, Entity, PrimaryColumn, UpdateDateColumn, JoinTable, ManyToMany } from "typeorm"
import Track from "./Track"

@Entity()
export class Playlist {
  @PrimaryColumn()
  public id: string

  @Column()
  public name: string

  @UpdateDateColumn()
  public last_update: Date

  @ManyToMany(type => Track, track => track.id)
  @JoinTable()
  tracks: Track[]
}

export default Playlist
