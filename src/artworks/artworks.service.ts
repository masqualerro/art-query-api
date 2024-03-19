import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { Artwork } from './entities/artwork.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Image } from './entities/image.entity';

@Injectable()
export class ArtworksService {
  constructor(
    @InjectRepository(Artwork)
    private artworksRepository: Repository<Artwork>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async create(userId: number, createArtworkDto: CreateArtworkDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const image = this.imagesRepository.create(createArtworkDto.image);
    await this.imagesRepository.save(image);

    const artwork = this.artworksRepository.create({
      ...createArtworkDto,
      image,
      user,
    });

    return this.artworksRepository.save(artwork);
  }

  findAll() {
    return `This action returns all artworks`;
  }

  async findAllByUser(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return this.artworksRepository.find({
      where: { user: user },
      relations: { image: true },
    });
  }

  async mapId(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const artworks = await this.artworksRepository.find({
      where: { user: user },
      select: ['artwork_id'], // Select only the 'artwork_id' column
    });
    return artworks.map((artwork) => artwork.artwork_id); // Return an array of 'artwork_id's
  }

  findOne(id: number) {
    return `This action returns a #${id} artwork`;
  }

  async remove(id: number) {
    const artwork = await this.artworksRepository.findOne({
      where: { id: id },
      relations: ['image'],
    });

    if (artwork.image) {
      await this.imagesRepository.delete(artwork.image.id);
    }

    return this.artworksRepository.delete(id);
  }
}
