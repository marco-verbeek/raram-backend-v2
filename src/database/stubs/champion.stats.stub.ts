import { Champion } from 'src/stats/schemas/champion.schemas';

export const championStatsStub = (): Champion[] => {
  return [
    {
      totalHealed: 1642,
      totalDamageTaken: 27709,
      totalDamageDone: 28254,
      pentaKills: 0,
      quadraKills: 0,
      tripleKills: 0,
      doubleKills: 1,
      totalKP: 20,
      totalPointsLost: -10.2,
      totalPointsWon: 0,
      gamesWon: 0,
      gamesPlayed: 1,
      name: 'KogMaw',
      players: {
        ItsNexty: {
          '0': 1,
          '1': 0,
        },
      },
    },
    {
      totalHealed: 7917,
      totalDamageTaken: 46367,
      totalDamageDone: 16879,
      pentaKills: 0,
      quadraKills: 0,
      tripleKills: 1,
      doubleKills: 2,
      totalKP: 20,
      totalPointsLost: -7.9,
      totalPointsWon: 0,
      gamesWon: 0,
      gamesPlayed: 1,
      name: 'Riven',
      players: {
        ItsWolfy: {
          '0': 1,
          '1': 0,
        },
      },
    },
  ];
};
