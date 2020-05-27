import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Playlist from "./Playlist";

@Entity()
export class Salon {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @UpdateDateColumn()
  public lastUpdate: Date

  @OneToOne(type => Playlist)
  @JoinColumn()
  playlist: Playlist;
}

export default Salon
