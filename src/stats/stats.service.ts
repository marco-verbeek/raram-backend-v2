import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';
import { Player } from './schemas/player.schemas';
import { UpdateStatsDto } from './dto/update-stats.dto';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  async createAccountStats(discordId: string): Promise<Player> {
    return this.getAccountStats(discordId);
  }

  async getAccountStats(discordId: string): Promise<Player> {
    const stats = await this.statsRepository.findPlayer(discordId);

    return stats !== null ? stats : this.statsRepository.createPlayer(discordId);
  }

  async updateAccountStats(
    discordId: string,
    stats: UpdateStatsDto,
  ): Promise<Player> {
    return this.statsRepository.incrementPlayerStats(discordId, stats);
  }
}
