import { Controller, Get, Param } from '@nestjs/common';
import { AnalysesService } from './analyses.service';

@Controller('analyses')
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Get(':gameId')
  async getAnalysis(@Param('gameId') gameId: string) {
    return this.analysesService.analyseGameWithId(gameId);
  }
}
