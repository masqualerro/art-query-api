import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkInsightsService } from './artwork-insights.service';

describe('ArtworkInsightsService', () => {
  let service: ArtworkInsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtworkInsightsService],
    }).compile();

    service = module.get<ArtworkInsightsService>(ArtworkInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
