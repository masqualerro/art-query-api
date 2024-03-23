import {
  IsNumber,
  IsString,
  IsJSON,
  MaxLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageDto } from './create-image.dto';

export class CreateArtworkDto {
  @IsNumber()
  museum_id: number;

  @IsNumber()
  artwork_id: number;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  @MaxLength(500)
  artist: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  artwork_type: string;

  @IsOptional()
  @IsString()
  medium: string;

  @IsOptional()
  @IsJSON()
  colors: JSON;

  @IsOptional()
  @IsString()
  culture: string;

  @IsOptional()
  @IsJSON()
  styles: JSON;

  @ValidateNested()
  @Type(() => CreateImageDto)
  image: CreateImageDto;
}
