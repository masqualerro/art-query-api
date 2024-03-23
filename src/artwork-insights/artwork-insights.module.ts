import { Module } from '@nestjs/common';
import { ArtworkInsightsService } from './artwork-insights.service';
import { ArtworkInsightsController } from './artwork-insights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artwork } from 'src/artworks/entities/artwork.entity';
import { ArtworksService } from 'src/artworks/artworks.service';
import { User } from 'src/users/entities/user.entity';
import { Image } from 'src/artworks/entities/image.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Artwork, User, Image]), ConfigModule],
  controllers: [ArtworkInsightsController],
  providers: [ArtworkInsightsService, ArtworksService],
})
export class ArtworkInsightsModule {}
