import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AccountsService } from '../accounts/accounts.service';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly accountsService: AccountsService,
  ) {}

  @Get('/champions/:name')
  async getChampionStats(@Param('name') championName: string) {
    return this.statsService.getChampionStats(championName);
  }

  @Get('/summoners/:id')
  async getSummonerStats(@Param('id') id: string) {
    const accountById = await this.accountsService.getAccount(id);
    let accountByName;

    if (accountById === null) {
      accountByName =
        await this.accountsService.getVerifiedAccountBySummonerName(id);
    }

    // TODO: if account === null, return 404 profile not found.
    const account = accountById !== null ? accountById : accountByName;
    const stats = await this.statsService.getAccountStats(account['discordId']);

    return { summonerName: account.summonerName, stats: stats };
  }
}
