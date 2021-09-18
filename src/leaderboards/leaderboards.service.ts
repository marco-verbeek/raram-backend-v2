import { Injectable } from '@nestjs/common';
import { SummonersByRankDto } from './dto/summoners-by-rank.dto';
import { StatsRepository } from '../stats/stats.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { SummonersByWrDto } from './dto/summoners-by-wr.dto';
import { SummonersByPentaKillsDto } from './dto/summoners-by-pentakills.dto';
import { LeaderboardDto } from './dto/leaderboard.dto';

@Injectable()
export class LeaderboardsService {
  constructor(
    private readonly statsRepository: StatsRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  async getLeaderboards(): Promise<LeaderboardDto> {
    return {
      highestRanking: await this.getTop5SummonersByRank(),
      highestWinrate: await this.getTop5SummonersByWR(),
      highestPentaKills: await this.getTop5SummonersByPentaKills(),
    };
  }

  async getTop5SummonersByRank(): Promise<SummonersByRankDto[]> {
    const players = await this.statsRepository.findTop5HighestRankingPlayers();

    const summonersByRank: SummonersByRankDto[] = [];
    for (const player of players) {
      const account = await this.accountsRepository.findOne({
        discordId: player.discordId,
        verified: true,
      });

      summonersByRank.push({
        summonerName: account.summonerName,
        leaguePoints: player.leaguePoints,
      });
    }

    return summonersByRank;
  }

  async getTop5SummonersByWR(): Promise<SummonersByWrDto[]> {
    const players = await this.statsRepository.findTop5HighestWinRatePlayers();

    const summonersByWR: SummonersByWrDto[] = [];
    for (const player of players) {
      const account = await this.accountsRepository.findOne({
        discordId: player.discordId,
        verified: true,
      });

      summonersByWR.push({
        summonerName: account.summonerName,
        rankedGames: player.rankedGames,
        wins: player.wins,
        winrate: player.wins / player.rankedGames,
      });
    }

    return summonersByWR;
  }

  async getTop5SummonersByPentaKills(): Promise<SummonersByPentaKillsDto[]> {
    const players = await this.statsRepository.findTop5HighestPentaKillers();

    const summonersByPentaKills: SummonersByPentaKillsDto[] = [];
    for (const player of players) {
      const account = await this.accountsRepository.findOne({
        discordId: player.discordId,
        verified: true,
      });

      summonersByPentaKills.push({
        summonerName: account.summonerName,
        pentaKills: player.pentaKills,
      });
    }

    return summonersByPentaKills;
  }
}
