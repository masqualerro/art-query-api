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

  findOne(id: number) {
    return `This action returns a #${id} artwork`;
  }

  remove(id: number) {
    return this.artworksRepository.delete(id);
  }
}
