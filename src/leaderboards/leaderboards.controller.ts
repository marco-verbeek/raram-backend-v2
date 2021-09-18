import { Controller, Get } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get()
  async getLeaderboards() {
    return await this.leaderboardsService.getLeaderboards();
  }

  @Get('summoners/rank')
  async getTop5SummonersByRank() {
    return await this.leaderboardsService.getTop5SummonersByRank();
  }

  @Get('summoners/win-rate')
  async getTop5SummonersByWR() {
    return await this.leaderboardsService.getTop5SummonersByWR();
  }

  @Get('summoners/pentakills')
  async getTop5SummonersByPentaKills() {
    return await this.leaderboardsService.getTop5SummonersByPentaKills();
  }
}
