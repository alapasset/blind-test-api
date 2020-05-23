import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class SpotifyAuth {
  @PrimaryGeneratedColumn()
  public id: string

  @Column()
  public access_token: string

  @Column()
  public refresh_token: string

  @Column()
  public code: string

  @Column()
  public expire: Date
}

export default SpotifyAuth
