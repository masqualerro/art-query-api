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
  ): Promise<{ insights: any[]; total: number }> {
    const insights =
      await this.artworkInsightsService.getArtworkColorInsights(userId);
    return {
      insights: insights.colorInsights,
      total: insights.totalFrequency,
    };
  }

  @Get('culture/:userId')
  async getArtworkCultureInsights(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ insights: any[]; total: number }> {
    const insights =
      await this.artworkInsightsService.getArtworkCultureInsights(userId);
    return insights;
  }
}
