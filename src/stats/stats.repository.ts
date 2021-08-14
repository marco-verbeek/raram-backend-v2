import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stat, StatDocument } from './schemas/stat.schemas';

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
    stats: Partial<Stat>,
  ): Promise<Stat> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.statModel.findOneAndUpdate(
      { discordId: discordId },
      { $inc: { rankedGames: 1 } },
      {
        new: true,
      },
    );
  }
}
