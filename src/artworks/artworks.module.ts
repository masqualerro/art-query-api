import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { ArtworksController } from './artworks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Artwork } from './entities/artwork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artwork, User])],
  controllers: [ArtworksController],
  providers: [ArtworksService],
})
export class ArtworksModule {}
