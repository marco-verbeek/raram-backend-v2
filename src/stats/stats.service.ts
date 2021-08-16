import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';
import { Stat } from './schemas/stat.schemas';
import { UpdateStatsDto } from './dto/update-stats.dto';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  async createAccountStats(discordId: string): Promise<Stat> {
    return this.getAccountStats(discordId);
  }

  async getAccountStats(discordId: string): Promise<Stat> {
    const stats = await this.statsRepository.findOne(discordId);

    return stats !== null ? stats : this.statsRepository.create(discordId);
  }

  async updateAccountStats(
    discordId: string,
    stats: UpdateStatsDto,
  ): Promise<Stat> {
    return this.statsRepository.findOneAndIncrement(discordId, stats);
  }
}
