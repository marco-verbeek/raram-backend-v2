import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schemas';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { Tool, ToolDocument } from './schemas/tool.schemas';
import { Champion, ChampionDocument } from './schemas/champion.schemas';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectModel(Player.name) private playerStatsModel: Model<PlayerDocument>,
    @InjectModel(Champion.name)
    private championStatsModel: Model<ChampionDocument>,
    @InjectModel(Tool.name) private toolStatsModel: Model<ToolDocument>,
  ) {}

  createPlayer(discordId: string): Promise<Player> {
    const newStats = new this.playerStatsModel({ discordId });
    return newStats.save();
  }

  async findPlayer(discordId: string): Promise<Player> {
    return this.playerStatsModel.findOne({ discordId }).select('-__v -_id');
  }

  async incrementPlayerStats(
    discordId: string,
    stats: UpdateStatsDto,
  ): Promise<Player> {
    return this.playerStatsModel
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

  async getToolStats(): Promise<Tool> {
    return this.toolStatsModel.findOne({}).select('-__v -_id');
  }

  async addGameIdToAnalyzedGames(gameId: number): Promise<Tool> {
    return this.toolStatsModel
      .findOneAndUpdate(
        {},
        { $push: { analyzedGameIds: gameId } },
        { new: true },
      )
      .select('-__v -_id');
  }
}
