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

  async getChampionStats(name: string): Promise<Champion> {
    const stats = await this.statsRepository.getChampionStats(name);

    return stats !== null
      ? stats
      : this.statsRepository.createChampionStats(name);
  }

  async updateChampionStats(
    name: string,
    stats: UpdateChampStatsDto,
  ): Promise<Champion> {
    // Make sure there is an entry for this champion in the Map.
    await this.getChampionStats(name);

    return this.statsRepository.incrementChampionStats(name, stats);
  }
}
