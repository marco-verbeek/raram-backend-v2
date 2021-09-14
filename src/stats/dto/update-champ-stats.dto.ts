export class UpdateChampStatsDto {
  playedBySummonerName: string;
  win: boolean;

  totalPointsWon: number;
  totalPointsLost: number;

  totalKP: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;

  totalDamageDone: number;
  totalDamageTaken: number;
  totalHealed: number;
}
