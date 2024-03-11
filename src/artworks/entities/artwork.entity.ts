import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'artworks' })
export class Artwork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  museum_id: number;

  @Column()
  artwork_id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500 })
  artist: string;

  @Column()
  date: string;

  @Column()
  image_url: string;

  @Column()
  culture: string;

  @Column()
  artwork_type: string;

  @Column()
  medium: string;

  @Column('json')
  colors: any;

  @Column('json')
  classification: any;

  @ManyToOne(() => User, (user) => user.artworks, { onDelete: 'CASCADE' })
  user: User;
}
