import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Artwork } from './artwork.entity';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  artwork_id: number;

  @Column({ length: 1000 })
  imageUrl: string;

  @Column({ length: 300 })
  imageAlt: string;

  @Column()
  imageWidth: number;

  @Column()
  imageHeight: number;

  @OneToOne(() => Artwork, (artwork) => artwork.image, {
    onDelete: 'CASCADE',
  })
  artwork: Artwork;
}
