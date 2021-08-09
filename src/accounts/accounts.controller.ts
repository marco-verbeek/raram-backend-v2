import { Controller, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './schemas/account.schema';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/verify/:discordId/:summonerName')
  async verification(
    @Param('discordId') discordId: string,
    @Param('summonerName') summonerName: string,
  ) {
    const account: Account = await this.accountsService.getAccount(discordId);

    // if an account with that discordId has been found, and no summonerName is passed, verify third party code
    if (account !== null && !account.verified && summonerName === '')
      return this.accountsService.checkVerification(account);

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
    return this.accountsService.checkVerification(account);
  }

  @Get(':discordId')
  async getProfile(@Param('discordId') discordId: string) {
    return this.accountsService.getAccount(discordId);
  }

  @Get(':discordId/lastgame')
  async getLastGameId(@Param('discordId') discordId: string) {
    return this.accountsService.getLastGameId(discordId);
  }
}
