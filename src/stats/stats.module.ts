import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repository';

import { Player, PlayerSchema } from './schemas/player.schemas';
import { Champion, ChampionSchema } from './schemas/champion.schemas';
import { Tool, ToolSchema } from './schemas/tool.schemas';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Champion.name, schema: ChampionSchema },
      { name: Tool.name, schema: ToolSchema },
    ]),
    forwardRef(() => AccountsModule),
  ],
  controllers: [StatsController],
  providers: [StatsService, StatsRepository],
  exports: [StatsService, StatsRepository],
})
export class StatsModule {}
