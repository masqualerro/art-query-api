import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Artwork } from 'src/artworks/entities/artwork.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  email: string;

  @Column({ length: 500 })
  name: string;

  @Column()
  age: number;

  @Column()
  password: string;

  @Column()
  color: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => Artwork, (artwork) => artwork.user, { cascade: true })
  artworks: Artwork[];
}
