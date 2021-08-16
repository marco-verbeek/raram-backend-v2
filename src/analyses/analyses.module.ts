import { Module } from '@nestjs/common';

import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [AccountsModule],
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}
