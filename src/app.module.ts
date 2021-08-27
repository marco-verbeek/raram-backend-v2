import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalysesModule } from './analyses/analyses.module';
import { AccountsModule } from './accounts/accounts.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    AnalysesModule,
    AccountsModule,
    StatsModule,
  ],
})
export class AppModule {}
