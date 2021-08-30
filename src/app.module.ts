import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalysesModule } from './analyses/analyses.module';
import { AccountsModule } from './accounts/accounts.module';
import { StatsModule } from './stats/stats.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    AnalysesModule,
    AccountsModule,
    StatsModule,
    LeaderboardsModule,
  ],
})
export class AppModule {}
