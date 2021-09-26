import { Module } from '@nestjs/common';
import { AnalysesModule } from './analyses/analyses.module';
import { AccountsModule } from './accounts/accounts.module';
import { StatsModule } from './stats/stats.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AnalysesModule,
    AccountsModule,
    StatsModule,
    LeaderboardsModule,
  ],
})
export class AppModule {}
