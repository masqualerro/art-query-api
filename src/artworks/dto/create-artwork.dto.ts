import {
  IsNumber,
  IsString,
  IsJSON,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateArtworkDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  museum_id: number;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  @MaxLength(500)
  artist: string;

  @IsString()
  date: string;

  @IsString()
  image_url: string;

  @IsOptional()
  @IsString()
  artwork_type: string;

  @IsOptional()
  @IsJSON()
  classification: JSON;

  @IsOptional()
  @IsString()
  medium: string;

  @IsOptional()
  @IsJSON()
  colors: JSON;

  @IsOptional()
  @IsString()
  culture: string;
}
