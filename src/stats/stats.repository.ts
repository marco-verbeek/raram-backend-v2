import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stat, StatDocument } from './schemas/stat.schemas';
import { UpdateStatsDto } from './dto/update-stats.dto';

@Injectable()
export class StatsRepository {
  constructor(@InjectModel(Stat.name) private statModel: Model<StatDocument>) {}

  create(discordId: string): Promise<Stat> {
    const newStats = new this.statModel({ discordId });
    return newStats.save();
  }

  findOne(discordId: string): Promise<Stat> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.statModel.findOne({ discordId });
  }

  async findOneAndIncrement(
    discordId: string,
    stats: UpdateStatsDto,
  ): Promise<Stat> {
    return this.statModel.findOneAndUpdate(
      { discordId: discordId },
      {
        $inc: {
          rankedGames: 1,
          wins: stats.win ? 1 : 0,
          doubleKills: stats.doubleKills,
          tripleKills: stats.tripleKills,
          quadraKills: stats.quadraKills,
          pentaKills: stats.pentaKills,
          goldEarned: stats.goldEarned,
          goldSpent: stats.goldSpent,
          timeSpentAlive: stats.timeSpentAlive,
        },
      },
      {
        new: true,
      },
    );
  }
}
