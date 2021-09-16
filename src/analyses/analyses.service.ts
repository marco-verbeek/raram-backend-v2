import { Injectable } from '@nestjs/common';

import { RegionGroups } from 'twisted/dist/constants';
import { LolApi } from 'twisted';

import { Player } from './interfaces/player.interface';
import { Team } from './interfaces/team.interface';
import { Analysis } from './interfaces/analysis.interface';

import { MatchParticipantsIdentitiesDto } from 'twisted/dist/models-dto';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/schemas/account.schema';
import { StatsService } from '../stats/stats.service';
import { MatchV5DTOs } from 'twisted/dist/models-dto/matches/match-v5';

@Injectable()
export class AnalysesService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly statsService: StatsService,
  ) {}
  LeagueAPI = new LolApi();

  /**
   * Limits a certain number with following logic: <br/>
   * * if the number is lower than min, selects min. <br/>
   * * if the number is higher than max, selects max.
   * @param gain The number that is going to get limited.
   * @param min The lowest amount allowed
   * @param max The highest amount allowed
   * @returns {number} gain if between min and max, min if lower than min, max if higher than max
   */
  limit = (gain = 0, min = -4, max = 4): number => {
    return gain < 0 ? Math.max(min, gain) : Math.min(gain, max);
  };

  /**
   * Calculates how much LP should be gained.
   * @note this is a helper function specific to my needs. You will probably never ever need it.
   * @param gain percentage that will determine pre-multiplier amount
   * @param multiplier will be multiplied with gain
   * @param resultMultiplier result of previous operation will be multiplied with resultMultiplier
   * @returns {number} 2-decimal float representing (gain*multiplier) * resultMultiplier
   */
  calculateGain = (gain, multiplier = 10, resultMultiplier = 1): number => {
    return this.limit(resultMultiplier * +(multiplier * gain).toFixed(2));
  };

  /**
   * Formats the value provided to a 2-decimal float
   * @param value the value you wish to format
   * @returns {number} formatted value
   */
  format = (value): number => {
    return parseFloat(value.toFixed(2));
  };

  /**
   * Finds a summoner's Identity from its participantId
   * @param matchData match data returned by Riot's API
   * @param participantId function finds identity from this participantId
   * @returns {JSON} representing a summonerDTO (see Riot's API documentation)
   */
  getParticipantIdentity(
    matchData: MatchV5DTOs.MatchDto,
    participantId,
  ): MatchV5DTOs.ParticipantDto {
    const matchDataIdentities = matchData.info;

    return matchDataIdentities.participants.find(
      (e) => e.participantId === participantId,
    );
  }

  /**
   * Performs the analysis based on the matchData received.
   * @param matchData: game data based on MatchDto received when querying the Twisted API
   */
  performMatchAnalysis = async (
    matchData: MatchV5DTOs.MatchDto,
  ): Promise<Analysis> => {
    const matchDataInfo = matchData.info;

    const players: Player[] = [];
    const teams: Team[] = [];

    const allAnalyzedGameIds = await this.statsService.getAnalyzedGameIds();
    const gameAlreadyAnalyzed =
      allAnalyzedGameIds.indexOf(matchDataInfo.gameId) > -1;

    for (const e of matchDataInfo.participants) {
      const participant = {};

      const identity: MatchV5DTOs.ParticipantDto = this.getParticipantIdentity(
        matchData,
        e['participantId'],
      );

      participant['summonerName'] = identity.summonerName;

      participant['championId'] = identity.championId;

      participant['champion'] = identity.championName;
      participant['teamId'] = identity.teamId;

      participant['kills'] = identity.kills;
      participant['deaths'] = identity.deaths;
      participant['assists'] = identity.assists;

      participant['KP'] = identity.kills + identity.assists;

      participant['damageDone'] = identity.totalDamageDealtToChampions;
      participant['damageTaken'] = identity.totalDamageTaken;
      participant['healed'] = identity.totalHeal;

      participant['doubleKills'] = identity.doubleKills;
      participant['tripleKills'] = identity.tripleKills;
      participant['quadraKills'] = identity.quadraKills;
      participant['pentaKills'] = identity.pentaKills;

      participant['goldEarned'] = identity.goldEarned;
      participant['goldSpent'] = identity.goldSpent;

      participant['totalMinionsKilled'] = identity.totalMinionsKilled;
      participant['firstBloodKill'] = identity.firstBloodKill;
      participant['longestTimeSpentLiving'] = identity.longestTimeSpentLiving;

      players.push(<Player>participant);

      // Team-related information
      let team = teams.find((elem) => elem.teamId === e.teamId);
      if (team === undefined) {
        team = <Team>{
          teamId: identity.teamId,
          win: identity.win,
          totalKills: identity.kills,
          totalAssists: identity.assists,
          totalDeaths: identity.deaths,
          totalDamageDone: identity.totalDamageDealtToChampions,
          totalDamageTaken: identity.totalDamageTaken,
          totalHealed: identity.totalHeal,
        };

        teams.push(<Team>team);
      } else {
        team['totalKills'] += identity.kills;
        team['totalAssists'] += identity.assists;
        team['totalDeaths'] += identity.deaths;
        team['totalDamageDone'] += identity.totalDamageDealtToChampions;
        team['totalDamageTaken'] += identity.totalDamageTaken;
        team['totalHealed'] += identity.totalHeal;
      }
    }

    // Calculate team-averages
    teams.forEach((team) => {
      team['avgKP'] = (team['totalKills'] + team['totalAssists']) / 5;
      team['avgDeaths'] = team['totalDeaths'] / 5;

      team['avgDamageDone'] = team['totalDamageDone'] / 5;
      team['avgDamageTaken'] = team['totalDamageTaken'] / 5;
      team['avgHealed'] = team['totalHealed'] / 5;
    });

    // Calculate team-comparisons and gains and total LP
    for (const player of players) {
      const account =
        await this.accountsService.getVerifiedAccountBySummonerName(
          player.summonerName,
        );

      const team = teams.find((team) => team.teamId === player.teamId);

      player['teamComparedKP'] = this.format(
        (player['KP'] - team['avgKP']) / team['avgKP'],
      );
      player['teamComparedDeaths'] = this.format(
        (player['deaths'] - team['avgDeaths']) / team['avgDeaths'],
      );

      player['teamComparedDamageDone'] = this.format(
        (player['damageDone'] - team['avgDamageDone']) / team['avgDamageDone'],
      );
      player['teamComparedDamageTaken'] = this.format(
        (player['damageTaken'] - team['avgDamageTaken']) /
          team['avgDamageTaken'],
      );
      player['teamComparedHealed'] = this.format(
        (player['healed'] - team['avgHealed']) / team['avgHealed'],
      );

      // Only calculate rank-related information if the player has a rARAM account.
      if (account === null) continue;

      player['KPGain'] = this.calculateGain(player['teamComparedKP'], 10, 2);
      player['deathsGain'] = this.calculateGain(
        player['teamComparedDeaths'],
        10,
        -1,
      );

      player['damageDoneGain'] = this.calculateGain(
        player['teamComparedDamageDone'],
      );
      player['damageTakenGain'] = this.calculateGain(
        player['teamComparedDamageTaken'],
      );
      player['healedGain'] = this.calculateGain(player['teamComparedHealed']);

      const lpGain = this.format(
        (team['win'] ? 10 : -10) +
          player['KPGain'] +
          player['deathsGain'] +
          Math.max(
            player['damageDoneGain'],
            player['damageTakenGain'],
            player['healedGain'],
          ),
      );

      player['lpGain'] = lpGain;

      // This game has might not yet have been accounted for: add lpGain to current leaguePoints!
      const stats = await this.statsService.getAccountStats(account.discordId);
      player['leaguePoints'] = gameAlreadyAnalyzed
        ? stats.leaguePoints
        : stats.leaguePoints + lpGain;
    }

    return {
      teams: teams,
      players: players,
      game: {
        gameDuration: matchDataInfo.gameDuration,
        gameCreation: matchDataInfo.gameCreation,
        queueId: matchDataInfo.queueId,
        gameId: matchDataInfo.gameId,
      },
    };
  };

  /**
   * Adds every players' data to the database, if the player has a rARAM account.
   * @param analysis the game analysis containing every players' data
   */
  addAnalysisToDb = async (analysis: Analysis): Promise<void> => {
    const gameId: number = analysis.game.gameId;

    const allAnalyzedGameIds = await this.statsService.getAnalyzedGameIds();
    const hasAlreadyBeenAnalyzed = allAnalyzedGameIds.indexOf(gameId) > -1;

    // Make sure that this game has not yet been analyzed.
    if (hasAlreadyBeenAnalyzed) return;

    await this.statsService.addGameIdToAnalyzedGames(gameId);

    const winningTeamId: number = analysis.teams.find(
      (team) => team.win,
    ).teamId;

    const players: Player[] = analysis.players;

    for (const player of players) {
      const account: Account =
        await this.accountsService.getVerifiedAccountBySummonerName(
          player.summonerName,
        );

      if (account === null) continue;

      await this.statsService.updateAccountStats(account.discordId, {
        win: player.teamId === winningTeamId,
        leaguePoints: player.lpGain,

        goldEarned: player.goldEarned,
        goldSpent: player.goldSpent,

        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        firstBloodKill: player.firstBloodKill,

        doubleKills: player.doubleKills,
        tripleKills: player.tripleKills,
        quadraKills: player.quadraKills,
        pentaKills: player.pentaKills,

        damageDealt: player.damageDone,
        damageTaken: player.damageTaken,
        healed: player.healed,
      });
      console.log('Updated stats for ' + player.summonerName);

      await this.statsService.updateChampionStats(player.champion, {
        playedBySummonerName: player.summonerName,
        win: player.teamId === winningTeamId,
        totalKP: player.kills + player.assists,

        totalPointsWon: player.teamId === winningTeamId ? player.lpGain : 0,
        totalPointsLost: player.teamId !== winningTeamId ? player.lpGain : 0,

        doubleKills: player.doubleKills,
        tripleKills: player.tripleKills,
        quadraKills: player.quadraKills,
        pentaKills: player.pentaKills,

        totalDamageDone: player.damageDone,
        totalDamageTaken: player.damageTaken,
        totalHealed: player.healed,
      });
      console.log('Update champion stats for ' + player.champion);
    }
  };

  async analyseGameWithId(gameId: string): Promise<Analysis> {
    const match = await this.LeagueAPI.MatchV5.get(gameId, RegionGroups.EUROPE);
    const analysis = await this.performMatchAnalysis(match.response);

    await this.addAnalysisToDb(analysis);

    return analysis;
  }
}
