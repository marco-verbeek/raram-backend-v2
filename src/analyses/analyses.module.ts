import { Module } from '@nestjs/common';

import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { AccountsModule } from '../accounts/accounts.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [AccountsModule, StatsModule],
  controllers: [AnalysesController],
  providers: [AnalysesService],
  exports: [AnalysesService],
})
export class AnalysesModule {}
