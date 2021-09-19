import { SummonersByHighestAvgKP } from './summoners-by-highest-kp.dto';
import { SummonersByHighestAvgWinLP } from './summoners-by-highest-win-lp.dto';
import { SummonersByLowestAvgDeathsDto } from './summoners-by-lowest-avg-deaths.dto';
import { SummonersByPentaKillsDto } from './summoners-by-pentakills.dto';
import { SummonersByRankDto } from './summoners-by-rank.dto';
import { SummonersByWrDto } from './summoners-by-wr.dto';

export class LeaderboardDto {
  highestRanking: SummonersByRankDto[];
  highestWinrate: SummonersByWrDto[];
  highestPentaKills: SummonersByPentaKillsDto[];
  highestAvgKP: SummonersByHighestAvgKP[];
  lowestAvgDeaths: SummonersByLowestAvgDeathsDto[];
  highestAvgWinLP: SummonersByHighestAvgWinLP[];
}
