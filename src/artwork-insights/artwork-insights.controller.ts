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
  ): Promise<{
    insights: any[];
    total: number;
  }> {
    const insights =
      await this.artworkInsightsService.getArtworkColorInsights(userId);
    return {
      insights: insights.colorInsights,
      total: insights.totalFrequency,
    };
  }

  @Get('ai/color/:userId')
  async getAiColorInsight(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<string> {
    const insights =
      await this.artworkInsightsService.getAiColorInsight(userId);
    return insights;
  }

  @Get('culture/:userId')
  async getArtworkCultureInsights(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ insights: any[]; total: number }> {
    const insights =
      await this.artworkInsightsService.getArtworkCultureInsights(userId);
    return insights;
  }

  @Get('styles/:userId')
  async getArtworkStyleInsights(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ insights: any[]; total: number }> {
    const insights =
      await this.artworkInsightsService.getArtworkStyleInsights(userId);
    return insights;
  }

  @Get('ai/culture/:userId')
  async getAiCultureInsight(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<string> {
    const insights =
      await this.artworkInsightsService.getAiCultureInsight(userId);
    return insights;
  }

  @Get('ai/style/:userId')
  async getAiStyleInsight(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<string> {
    const insights =
      await this.artworkInsightsService.getAiStyleInsight(userId);
    return insights;
  }

  // @Get('ai/artist/:userId')
  // async getAiArtistInsight(
  //   @Param('userId', ParseIntPipe) userId: number,
  // ): Promise<string> {
  //   const insights =
  //     await this.artworkInsightsService.getAiArtistInsight(userId);
  //   return insights;
  // }

  @Get('artists/:userId')
  async getArtworkArtistInsights(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ insights: any[]; total: number }> {
    const insights =
      await this.artworkInsightsService.getArtistInsights(userId);
    return insights;
  }

  @Get('ai/summary/:userId')
  async getAiSummaryInsight(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<string> {
    const insights =
      await this.artworkInsightsService.getAiInsightSummary(userId);
    return insights;
  }
}
