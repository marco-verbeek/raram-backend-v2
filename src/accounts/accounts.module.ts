import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Account, AccountSchema } from './schemas/account.schema';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';

import { Stat, StatSchema } from '../stats/schemas/stat.schemas';
import { StatsService } from '../stats/stats.service';
import { StatsRepository } from '../stats/stats.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Stat.name, schema: StatSchema },
    ]),
  ],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    AccountsRepository,
    StatsService,
    StatsRepository,
  ],
  exports: [AccountsService, AccountsRepository],
})
export class AccountsModule {}
