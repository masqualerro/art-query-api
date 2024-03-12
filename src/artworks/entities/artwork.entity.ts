import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Image } from './image.entity';

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

  @Column({ nullable: true, default: null })
  artwork_type: string;

  @Column('json', { nullable: true, default: null })
  classification: any;

  @Column({ nullable: true, default: null })
  medium: string;

  @Column('json', { nullable: true, default: null })
  colors: any;

  @Column({ nullable: true, default: null })
  culture: string;

  @Column('json', { nullable: true, default: null })
  styles: any;

  @ManyToOne(() => User, (user) => user.artworks, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Image, (image) => image.artwork, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  image: Image;
}
