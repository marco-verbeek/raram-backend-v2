import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AnalysesModule } from 'src/analyses/analyses.module';
import { QueuesController } from './queues.controller';
import { QueuesService } from './queues.service';

@Module({
  imports: [AccountsModule, AnalysesModule],
  providers: [QueuesService],
  controllers: [QueuesController],
})
export class QueuesModule {}
