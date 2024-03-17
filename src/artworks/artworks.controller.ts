import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { CreateArtworkDto } from './dto/create-artwork.dto';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createArtworkDto: CreateArtworkDto,
  ) {
    return this.artworksService.create(userId, createArtworkDto);
  }

  @Get()
  findAll() {
    return this.artworksService.findAll();
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.artworksService.findAllByUser(userId);
  }

  @Get('map/:userId')
  mapIds(@Param('userId', ParseIntPipe) userId: number) {
    return this.artworksService.mapId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artworksService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.artworksService.remove(id);
  }
}
