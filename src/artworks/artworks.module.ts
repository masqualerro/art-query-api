import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { ArtworksController } from './artworks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Artwork } from './entities/artwork.entity';
import { Image } from './entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artwork, User, Image])],
  controllers: [ArtworksController],
  providers: [ArtworksService],
})
export class ArtworksModule {}
