import { Controller, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './schemas/account.schema';
import { StatsService } from '../stats/stats.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly statsService: StatsService,
  ) {}

  @Get('/verify/:discordId/:summonerName')
  async verification(
    @Param('discordId') discordId: string,
    @Param('summonerName') summonerName: string,
  ) {
    const account: Account = await this.accountsService.getAccount(discordId);

    // Cannot link account to an already-linked LoL account.
    const accountsWithName =
      await this.accountsService.getAccountsBySummonerName(summonerName);

    if (accountsWithName.length !== 0) {
      const verifiedAccount =
        await this.accountsService.getVerifiedAccountBySummonerName(
          summonerName,
        );

      if (verifiedAccount !== null) return verifiedAccount;
    }

    // If there are no accounts linked to discordId, create a new one.
    if (account === null || account === undefined) {
      await this.statsService.createAccountStats(discordId);
      return this.accountsService.createAccount(discordId, summonerName);
    }

    // There's already a verified account linked to this discordId.
    if (account.verified) {
      return account;
    }

    // User wants to change the summonerName linked to his discordId.
    if (account.summonerName !== summonerName) {
      return this.accountsService.updateAccount(discordId, summonerName);
    }

    // call Riot API for verifying third party code with db uuid
    return this.accountsService.checkVerification(account);
  }

  @Get('/verify/:discordId')
  async verification2(@Param('discordId') discordId: string) {
    const account: Account = await this.accountsService.getAccount(discordId);

    if (account === null) {
      return {
        error: 'There is no account linked to this discordId to verify.',
      };
    }

    if (!account.verified)
      return this.accountsService.checkVerification(account);

    return account;
  }

  @Get(':discordId')
  async getProfile(@Param('discordId') discordId: string) {
    return this.accountsService.getAccount(discordId);
  }

  @Get(':discordId/lastgame')
  async getLastGameId(@Param('discordId') discordId: string) {
    return this.accountsService.getLastGameId(discordId);
  }

  @Get(':id/profile')
  async getAccountStats(@Param('id') id: string) {
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
