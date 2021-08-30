import { Module } from '@nestjs/common';
import { LeaderboardsController } from './leaderboards.controller';
import { LeaderboardsService } from './leaderboards.service';
import { StatsModule } from '../stats/stats.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [StatsModule, AccountsModule],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
})
export class LeaderboardsModule {}
