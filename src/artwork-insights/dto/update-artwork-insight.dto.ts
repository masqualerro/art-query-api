import { PartialType } from '@nestjs/swagger';
import { CreateArtworkInsightDto } from './create-artwork-insight.dto';

export class UpdateArtworkInsightDto extends PartialType(CreateArtworkInsightDto) {}
