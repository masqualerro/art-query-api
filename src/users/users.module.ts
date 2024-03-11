import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artwork } from 'src/artworks/entities/artwork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Artwork])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
