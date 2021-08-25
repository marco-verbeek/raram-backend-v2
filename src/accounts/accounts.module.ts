import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Account, AccountSchema } from './schemas/account.schema';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';

import { Player, PlayerSchema } from '../stats/schemas/player.schemas';
import { StatsService } from '../stats/stats.service';
import { StatsRepository } from '../stats/stats.repository';
import { Champion, ChampionSchema } from '../stats/schemas/champion.schemas';
import { Tool, ToolSchema } from '../stats/schemas/tool.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Champion.name, schema: ChampionSchema },
      { name: Tool.name, schema: ToolSchema },
    ]),
  ],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    AccountsRepository,
    StatsService,
    StatsRepository,
  ],
  exports: [AccountsService, AccountsRepository, StatsService, StatsRepository],
})
export class AccountsModule {}
