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
    const account: Account = await this.accountsService.getFullAccount(
      discordId,
    );

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
    const verification = await this.accountsService.checkVerification(account);

    if (verification.verified) {
      await this.statsService.incrementVerifiedAccounts();
    }

    return verification;
  }

  @Get('/verify/:discordId')
  async verificationById(@Param('discordId') discordId: string) {
    const account: Account = await this.accountsService.getFullAccount(
      discordId,
    );

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
  async getAccount(@Param('discordId') discordId: string) {
    return this.accountsService.getAccount(discordId);
  }

  @Get(':discordId/last-game')
  async getLastGameId(@Param('discordId') discordId: string) {
    return this.accountsService.getLastGameId(discordId);
  }
}
