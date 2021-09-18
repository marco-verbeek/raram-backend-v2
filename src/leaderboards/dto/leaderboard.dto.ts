import { SummonersByPentaKillsDto } from './summoners-by-pentakills.dto';
import { SummonersByRankDto } from './summoners-by-rank.dto';
import { SummonersByWrDto } from './summoners-by-wr.dto';

export class LeaderboardDto {
  highestRanking: SummonersByRankDto[];
  highestWinrate: SummonersByWrDto[];
  highestPentaKills: SummonersByPentaKillsDto[];
}
