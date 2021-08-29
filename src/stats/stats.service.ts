import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';
import { Player } from './schemas/player.schemas';
import { UpdatePlayerStatsDto } from './dto/update-player-stats.dto';
import { Tool } from './schemas/tool.schemas';
import { Champion } from './schemas/champion.schemas';
import { UpdateChampStatsDto } from './dto/update-champ-stats.dto';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  // TODO: createAccountStats and getAccountStats should be merged ?
  async createAccountStats(discordId: string): Promise<Player> {
    return this.getAccountStats(discordId);
  }

  async getAccountStats(discordId: string): Promise<Player> {
    const stats = await this.statsRepository.findPlayer(discordId);

    return stats !== null
      ? stats
      : this.statsRepository.createPlayer(discordId);
  }

  async updateAccountStats(
    discordId: string,
    stats: UpdatePlayerStatsDto,
  ): Promise<Player> {
    return this.statsRepository.incrementPlayerStats(discordId, stats);
  }

  async getAnalyzedGameIds(): Promise<number[]> {
    const stats = await this.statsRepository.getToolStats();
    return stats.analyzedGameIds;
  }

  async addGameIdToAnalyzedGames(gameId: number): Promise<Tool> {
    return this.statsRepository.addGameIdToAnalyzedGames(gameId);
  }

  async incrementVerifiedAccounts(): Promise<Tool> {
    return this.statsRepository.incrementVerifiedAccounts();
  }

  async createChampionStats(name: string): Promise<Champion> {
    return this.statsRepository.createChampionStats(name);
  }

  async getChampionStats(name: string): Promise<Champion> {
    const stats = await this.statsRepository.getChampionStats(name);

    if (stats.players !== null) {
      // This is absolutely horrendous ; TS thinks stats.players is a badly configured Map. (see champion schema)
      // If you're reading this, please send me a message with a solution?
      const players = <Map<string, number>>(<unknown>stats.players);
      const top5 = [...players.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      stats.players = top5;
    }

    return stats;
  }

  async updateChampionStats(
    name: string,
    stats: UpdateChampStatsDto,
  ): Promise<Champion> {
    const exists = await this.statsRepository.champStatsExist(name);
    if (!exists) await this.createChampionStats(name);

    return this.statsRepository.incrementChampionStats(name, stats);
  }
}
