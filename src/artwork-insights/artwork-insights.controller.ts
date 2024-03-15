import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ArtworkInsightsService } from './artwork-insights.service';

@Controller('artwork-insights')
export class ArtworkInsightsController {
  constructor(
    private readonly artworkInsightsService: ArtworkInsightsService,
  ) {}

  @Get('colors/:userId')
  async getArtworkColorInsights(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any[]> {
    return this.artworkInsightsService.getArtworkColorInsights(userId);
  }
}
