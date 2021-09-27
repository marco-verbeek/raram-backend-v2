import { LeaderboardDto } from 'src/leaderboards/dto/leaderboard.dto';

export const leaderboardsStub = (): LeaderboardDto => {
  return {
    highestRanking: [
      {
        summonerName: 'ItsNexty',
        leaguePoints: 100,
      },
      {
        summonerName: '0wly',
        leaguePoints: 90,
      },
      {
        summonerName: 'ItsWolfy',
        leaguePoints: 80,
      },
      {
        summonerName: 'Callback Cat',
        leaguePoints: 70,
      },
      {
        summonerName: 'Hypertext Assassin',
        leaguePoints: 60,
      },
    ],
    highestWinrate: [
      {
        summonerName: 'Callback Cat',
        rankedGames: 10,
        wins: 10,
        winrate: 1,
      },
      {
        summonerName: '0wly',
        rankedGames: 10,
        wins: 8,
        winrate: 0.8,
      },
      {
        summonerName: 'ItsWolfy',
        rankedGames: 10,
        wins: 7,
        winrate: 0.7,
      },
      {
        summonerName: 'ItsNexty',
        rankedGames: 10,
        wins: 6,
        winrate: 0.6,
      },
      {
        summonerName: 'Runtime Terror',
        rankedGames: 10,
        wins: 5,
        winrate: 0.5,
      },
    ],
    highestPentaKills: [
      {
        summonerName: 'ItsWolfy',
        pentaKills: 5,
      },
      {
        summonerName: '0wly',
        pentaKills: 3,
      },
      {
        summonerName: 'ItsNexty',
        pentaKills: 2,
      },
      {
        summonerName: 'Runtime Terror',
        pentaKills: 1,
      },
      {
        summonerName: 'Callback Cat',
        pentaKills: 0,
      },
    ],
    highestAvgKP: [
      {
        summonerName: 'Callback Cat',
        avgKP: 60,
      },
      {
        summonerName: 'Hypertext Assassin',
        avgKP: 53.2,
      },
      {
        summonerName: '0wly',
        avgKP: 52.8,
      },
      {
        summonerName: 'ItsWolfy',
        avgKP: 41.4,
      },
      {
        summonerName: 'ItsNexty',
        avgKP: 40,
      },
    ],
    lowestAvgDeaths: [
      {
        summonerName: 'Runtime Terror',
        avgDeaths: 1.5,
      },
      {
        summonerName: '0wly',
        avgDeaths: 1.6,
      },
      {
        summonerName: 'ItsWolfy',
        avgDeaths: 1.8,
      },
      {
        summonerName: 'ItsNexty',
        avgDeaths: 2,
      },
      {
        summonerName: 'Callback Cat',
        avgDeaths: 2.5,
      },
    ],
    highestAvgWinLP: [
      {
        summonerName: 'Callback Cat',
        avgWinLP: 16,
      },
      {
        summonerName: '0wly',
        avgWinLP: 13.6,
      },
      {
        summonerName: 'ItsWolfy',
        avgWinLP: 12.6,
      },
      {
        summonerName: 'Runtime Terror',
        avgWinLP: 9.5,
      },
      {
        summonerName: 'ItsNexty',
        avgWinLP: 8,
      },
    ],
  };
};
