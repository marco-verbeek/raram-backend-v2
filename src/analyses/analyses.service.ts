import { Injectable } from '@nestjs/common';

import { Regions } from 'twisted/dist/constants';
import { LolApi } from 'twisted';

import { Player } from './interfaces/player.interface';
import { Team } from './interfaces/team.interface';
import { Analysis } from './interfaces/analysis.interface';

import {
  MatchDto,
  MatchParticipantsIdentitiesDto,
} from 'twisted/dist/models-dto';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/schemas/account.schema';
import { StatsService } from '../stats/stats.service';
import { UpdatePlayerStatsDto } from '../stats/dto/update-player-stats.dto';
import { Champion } from '../stats/schemas/champion.schemas';

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
    matchData: MatchDto,
    participantId,
  ): MatchParticipantsIdentitiesDto {
    return matchData.participantIdentities.find(
      (e: MatchParticipantsIdentitiesDto) => e.participantId === participantId,
    );
  }

  /**
   * Returns the champion name by champion id. Uses Twisted, and returns 'Unknown' if not found.
   * @param championId the id representing which champion we're looking for
   */
  async getChampionName(championId: number): Promise<string> {
    try {
      const champion = await this.LeagueAPI.DataDragon.getChampion(championId);
      return champion.name;
    } catch (e) {
      console.log(
        'Could not find champion with ID ' +
          championId +
          '. Therefore, I returned Unknown.',
      );

      return 'Unknown';
    }
  }

  /**
   * Performs the analysis based on the matchData received.
   * @param matchData: game data based on MatchDto received when querying the Twisted API
   */
  performMatchAnalysis = async (matchData: MatchDto): Promise<Analysis> => {
    const players: Player[] = [];
    const teams: Team[] = [];

    const allAnalyzedGameIds = await this.statsService.getAnalyzedGameIds();
    const gameAlreadyAnalyzed =
      allAnalyzedGameIds.indexOf(matchData.gameId) > -1;

    for (const e of matchData.participants) {
      const participant = {};

      const identity: MatchParticipantsIdentitiesDto =
        this.getParticipantIdentity(matchData, e['participantId']);

      participant['accountId'] = identity.player.accountId;
      participant['summonerName'] = identity['player']['summonerName'];

      participant['championId'] = e['championId'];

      participant['champion'] = await this.getChampionName(e['championId']);
      participant['teamId'] = e['teamId'];

      participant['kills'] = e['stats']['kills'];
      participant['deaths'] = e['stats']['deaths'];
      participant['assists'] = e['stats']['assists'];

      participant['KP'] = e['stats']['kills'] + e['stats']['assists'];

      participant['damageDone'] = e['stats']['totalDamageDealtToChampions'];
      participant['damageTaken'] = e['stats']['totalDamageTaken'];
      participant['healed'] = e['stats']['totalHeal'];

      participant['doubleKills'] = e['stats']['doubleKills'];
      participant['tripleKills'] = e['stats']['tripleKills'];
      participant['quadraKills'] = e['stats']['quadraKills'];
      participant['pentaKills'] = e['stats']['pentaKills'];

      participant['goldEarned'] = e['stats']['goldEarned'];
      participant['goldSpent'] = e['stats']['goldSpent'];

      participant['totalMinionsKilled'] = e['stats']['totalMinionsKilled'];
      participant['firstBloodKill'] = e['stats']['firstBloodKill'];
      participant['longestTimeSpentLiving'] =
        e['stats']['longestTimeSpentLiving'];

      players.push(<Player>participant);

      // Team-related information
      let team = teams.find((elem) => elem.teamId === e.teamId);
      if (team === undefined) {
        team = <Team>{
          teamId: e['teamId'],
          win: e['stats']['win'],
          totalKills: e['stats']['kills'],
          totalAssists: e['stats']['assists'],
          totalDeaths: e['stats']['deaths'],
          totalDamageDone: e['stats']['totalDamageDealtToChampions'],
          totalDamageTaken: e['stats']['totalDamageTaken'],
          totalHealed: e['stats']['totalHeal'],
        };

        teams.push(<Team>team);
      } else {
        team['totalKills'] += e['stats']['kills'];
        team['totalAssists'] += e['stats']['assists'];
        team['totalDeaths'] += e['stats']['deaths'];
        team['totalDamageDone'] += e['stats']['totalDamageDealtToChampions'];
        team['totalDamageTaken'] += e['stats']['totalDamageTaken'];
        team['totalHealed'] += e['stats']['totalHeal'];
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
        gameDuration: matchData['gameDuration'],
        gameCreation: matchData['gameCreation'],
        queueId: matchData['queueId'],
        gameId: matchData['gameId'],
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

        totalPointsWon:
          player.teamId === winningTeamId ? player.leaguePoints : 0,
        totalPointsLost:
          player.teamId !== winningTeamId ? player.leaguePoints : 0,

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

  async analyseGameWithId(gameId: number): Promise<Analysis> {
    const match = await this.LeagueAPI.Match.get(gameId, Regions.EU_WEST);
    const analysis = await this.performMatchAnalysis(match.response);

    await this.addAnalysisToDb(analysis);

    return analysis;
  }
}
