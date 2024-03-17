import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArtworksModule } from './artworks/artworks.module';
import { AuthModule } from './auth/auth.module';
import { ArtworkInsightsModule } from './artwork-insights/artwork-insights.module';
import { User } from './users/entities/user.entity';
import { Artwork } from './artworks/entities/artwork.entity';
import { ArtworkInsight } from './artwork-insights/entities/artwork-insight.entity';
import { Image } from './artworks/entities/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Artwork, ArtworkInsight, Image],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    UsersModule,
    ArtworksModule,
    AuthModule,
    ArtworkInsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
