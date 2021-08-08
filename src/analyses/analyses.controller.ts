import { Controller, Get, Param } from '@nestjs/common';
import { AnalysesService } from './analyses.service';
import { LolApi } from 'twisted';
import { Regions } from 'twisted/dist/constants';

@Controller('analyses')
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  LeagueAPI = new LolApi();

  @Get(':gameId')
  async getAnalysis(@Param('gameId') gameId: string) {
    const match = await this.LeagueAPI.Match.get(5399406298, Regions.EU_WEST);
    console.log(match.response);

    return this.analysesService.analyseGameWithId(gameId);
  }
}
