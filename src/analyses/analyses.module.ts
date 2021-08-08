import { Module } from '@nestjs/common';

import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';

@Module({
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}
