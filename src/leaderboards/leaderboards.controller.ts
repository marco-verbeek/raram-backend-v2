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

  @Get('summoners/penta-kills')
  async getTop5SummonersByPentaKills() {
    return await this.leaderboardsService.getTop5SummonersByPentaKills();
  }

  @Get('summoners/highest-avg-kp')
  async getTop5SummonersByHighestAvgKP() {
    return await this.leaderboardsService.getTop5SummonersByHighestAvgKP();
  }

  @Get('summoners/lowest-avg-deaths')
  async getTop5SummonersByLowestAvgDeaths() {
    return await this.leaderboardsService.getTop5SummonersByLowestAvgDeaths();
  }
}
