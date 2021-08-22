import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schemas';
import { UpdateStatsDto } from './dto/update-stats.dto';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectModel(Player.name) private statModel: Model<PlayerDocument>,
  ) {}

  create(discordId: string): Promise<Player> {
    const newStats = new this.statModel({ discordId });
    return newStats.save();
  }

  findOne(discordId: string): Promise<Player> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.statModel.findOne({ discordId }).select('-__v -_id');
  }

  async findOneAndIncrement(
    discordId: string,
    stats: UpdateStatsDto,
  ): Promise<Player> {
    return this.statModel
      .findOneAndUpdate(
        { discordId: discordId },
        {
          $inc: {
            rankedGames: 1,
            wins: stats.win ? 1 : 0,
            leaguePoints: stats.leaguePoints,
            goldEarned: stats.goldEarned,
            goldSpent: stats.goldSpent,
            kills: stats.kills,
            deaths: stats.deaths,
            assists: stats.assists,
            firstBloods: stats.firstBloodKill ? 1 : 0,
            doubleKills: stats.doubleKills,
            tripleKills: stats.tripleKills,
            quadraKills: stats.quadraKills,
            pentaKills: stats.pentaKills,
            damageDealt: stats.damageDealt,
            damageTaken: stats.damageTaken,
            healed: stats.healed,
          },
        },
        {
          new: true,
        },
      )
      .select('-__v -_id');
  }
}
