import { IsNumber, IsString } from 'class-validator';

export class CreateImageDto {
  @IsNumber()
  artwork_id: number;

  @IsString()
  imageUrl: string;

  @IsString()
  imageAlt: string;

  @IsNumber()
  imageWidth: number;

  @IsNumber()
  imageHeight: number;
}
