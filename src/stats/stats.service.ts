import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';
import { Stat } from './schemas/stat.schemas';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  async getAccountStats(discordId: string): Promise<Stat> {
    const stats = await this.statsRepository.findOne(discordId);

    return stats !== null ? stats : this.statsRepository.create(discordId);
  }

  async updateAccountStats(
    discordId: string,
    stats: Partial<Stat>,
  ): Promise<Stat> {
    return this.statsRepository.findOneAndIncrement(discordId, stats);
  }
}
