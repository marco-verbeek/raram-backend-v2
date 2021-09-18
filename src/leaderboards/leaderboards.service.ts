import { Injectable } from '@nestjs/common';
import { SummonersByRankDto } from './dto/summoners-by-rank.dto';
import { StatsRepository } from '../stats/stats.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { SummonersByWrDto } from './dto/summoners-by-wr.dto';
import { SummonersByPentaKillsDto } from './dto/summoners-by-pentakills.dto';
import { LeaderboardDto } from './dto/leaderboard.dto';
import { SummonersByLowestAvgDeathsDto } from './dto/summoners-by-lowest-avg-deaths.dto';
import { SummonersByHighestAvgKP } from './dto/summoners-by-highest-kp.dto';

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
      highestAvgKP: await this.getTop5SummonersByHighestAvgKP(),
      lowestAvgDeaths: await this.getTop5SummonersByLowestAvgDeaths(),
    };
  }

  async getTop5SummonersByRank(): Promise<SummonersByRankDto[]> {
    const players = await this.statsRepository.findTop5HighestRankingPlayers();

    const summonersByRank: SummonersByRankDto[] = [];
    for (const player of players) {
      const summonerName = (
        await this.accountsRepository.findVerifiedAccount(player.discordId)
      ).summonerName;

      summonersByRank.push({
        summonerName: summonerName,
        leaguePoints: player.leaguePoints,
      });
    }

    return summonersByRank;
  }

  async getTop5SummonersByWR(): Promise<SummonersByWrDto[]> {
    const players = await this.statsRepository.findTop5HighestWinRatePlayers();

    const summonersByWR: SummonersByWrDto[] = [];
    for (const player of players) {
      const summonerName = (
        await this.accountsRepository.findVerifiedAccount(player.discordId)
      ).summonerName;

      summonersByWR.push({
        summonerName: summonerName,
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
      const summonerName = (
        await this.accountsRepository.findVerifiedAccount(player.discordId)
      ).summonerName;

      summonersByPentaKills.push({
        summonerName: summonerName,
        pentaKills: player.pentaKills,
      });
    }

    return summonersByPentaKills;
  }

  async getTop5SummonersByHighestAvgKP(): Promise<SummonersByHighestAvgKP[]> {
    const players = await this.statsRepository.findTop5HighestAvgKP();

    const summonersByHighestAvgKP: SummonersByHighestAvgKP[] = [];
    for (const player of players) {
      const summonerName = (
        await this.accountsRepository.findVerifiedAccount(player.discordId)
      ).summonerName;

      summonersByHighestAvgKP.push({
        summonerName: summonerName,
        avgKP: (player.kills + player.assists) / player.rankedGames,
      });
    }

    return summonersByHighestAvgKP;
  }

  async getTop5SummonersByLowestAvgDeaths(): Promise<
    SummonersByLowestAvgDeathsDto[]
  > {
    const players = await this.statsRepository.findTop5LowestAvgDeaths();

    const summonersByLowestAvgDeaths: SummonersByLowestAvgDeathsDto[] = [];
    for (const player of players) {
      const summonerName = (
        await this.accountsRepository.findVerifiedAccount(player.discordId)
      ).summonerName;

      summonersByLowestAvgDeaths.push({
        summonerName: summonerName,
        avgDeaths: player.deaths / player.rankedGames,
      });
    }

    return summonersByLowestAvgDeaths;
  }
}
