import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkInsightsController } from './artwork-insights.controller';
import { ArtworkInsightsService } from './artwork-insights.service';

describe('ArtworkInsightsController', () => {
  let controller: ArtworkInsightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtworkInsightsController],
      providers: [ArtworkInsightsService],
    }).compile();

    controller = module.get<ArtworkInsightsController>(ArtworkInsightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
