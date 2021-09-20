import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schemas';
import { UpdatePlayerStatsDto } from './dto/update-player-stats.dto';
import { Tool, ToolDocument } from './schemas/tool.schemas';
import { Champion, ChampionDocument } from './schemas/champion.schemas';
import { UpdateChampStatsDto } from './dto/update-champ-stats.dto';

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

  async findTop5HighestRankingPlayers(): Promise<Player[]> {
    return this.playerStatsModel
      .find({})
      .sort({ leaguePoints: -1 })
      .limit(5)
      .select('-__v -_id');
  }

  async findTop5HighestPentaKillers(): Promise<Player[]> {
    return this.playerStatsModel
      .find({})
      .sort({ pentaKills: -1 })
      .limit(5)
      .select('-__v -_id');
  }

  async findTop5HighestWinRatePlayers(): Promise<Player[]> {
    return this.playerStatsModel
      .aggregate([
        {
          $project: {
            winrate: { $divide: ['$wins', '$rankedGames'] },
            discordId: 1,
            rankedGames: 1,
            wins: 1,
          },
        },
      ])
      .sort({ winrate: -1 })
      .limit(5);
  }

  async findTop5HighestAvgKP(): Promise<Player[]> {
    return this.playerStatsModel
      .aggregate([
        {
          $project: {
            avgKP: {
              $divide: [{ $add: ['$kills', '$assists'] }, '$rankedGames'],
            },
            discordId: 1,
            kills: 1,
            assists: 1,
            rankedGames: 1,
          },
        },
      ])
      .sort({ avgKP: -1 })
      .limit(5);
  }

  async findTop5LowestAvgDeaths(): Promise<Player[]> {
    return this.playerStatsModel
      .aggregate([
        {
          $project: {
            avgDeaths: { $divide: ['$deaths', '$rankedGames'] },
            discordId: 1,
            deaths: 1,
            rankedGames: 1,
          },
        },
      ])
      .sort({ avgDeaths: 1 })
      .limit(5);
  }

  async findTop5HighestAvgWinLP(): Promise<Player[]> {
    return this.playerStatsModel
      .aggregate([
        {
          $project: {
            avgWinLP: { $divide: ['$pointsWon', '$rankedGames'] },
            discordId: 1,
            pointsWon: 1,
            rankedGames: 1,
          },
        },
      ])
      .sort({ avgWinLP: -1 })
      .limit(5);
  }

  async incrementPlayerStats(
    discordId: string,
    stats: UpdatePlayerStatsDto,
  ): Promise<Player> {
    return this.playerStatsModel
      .findOneAndUpdate(
        { discordId: discordId },
        {
          $inc: {
            rankedGames: 1,
            wins: stats.win ? 1 : 0,
            leaguePoints: stats.leaguePoints,
            pointsWon: stats.win ? stats.leaguePoints : 0,
            pointsLost: stats.win ? 0 : stats.leaguePoints,
            goldEarned: stats.goldEarned,
            goldSpent: stats.goldSpent,
            kills: stats.kills,
            deaths: stats.deaths,
            assists: stats.assists,
            firstBloods: stats.firstBloodKill ? 1 : 0,
            firstBloodAssists: stats.firstBloodAssist ? 1 : 0,
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

  async incrementVerifiedAccounts(): Promise<Tool> {
    return this.toolStatsModel
      .findOneAndUpdate({}, { $inc: { verifiedAccounts: 1 } }, { new: true })
      .select('-__v -_id');
  }

  async champStatsExist(name: string): Promise<boolean> {
    return await this.championStatsModel.exists({ name });
  }

  async createChampionStats(name: string): Promise<Champion> {
    const newChamp = new this.championStatsModel({ name });
    return newChamp.save();
  }

  async getChampionStats(name: string): Promise<Champion> {
    return this.championStatsModel
      .findOne({
        name: { $regex: '^' + name + '$', $options: 'i' },
      })
      .lean()
      .select('-__v -_id');
  }

  async incrementChampionStats(
    name: string,
    stats: UpdateChampStatsDto,
  ): Promise<Champion> {
    const keyName = 'players.' + stats.playedBySummonerName;

    return this.championStatsModel
      .findOneAndUpdate(
        { name },
        {
          $inc: {
            gamesPlayed: 1,
            gamesWon: stats.win ? 1 : 0,

            totalPointsWon: stats.totalPointsWon,
            totalPointsLost: stats.totalPointsLost,

            totalKP: stats.totalKP,
            doubleKills: stats.doubleKills,
            tripleKills: stats.tripleKills,
            quadraKills: stats.quadraKills,
            pentaKills: stats.pentaKills,

            totalDamageDone: stats.totalDamageDone,
            totalDamageTaken: stats.totalDamageTaken,
            totalHealed: stats.totalHealed,

            // Total games played
            [keyName + '.0']: 1,
            // Total games won
            [keyName + '.1']: stats.win ? 1 : 0,
          },
        },
        { new: true },
      )
      .select('-__v -_id');
  }
}
