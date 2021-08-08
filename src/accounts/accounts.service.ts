import { Injectable } from '@nestjs/common';
import { Account } from './schemas/account.schema';
import { v4 as uuidv4 } from 'uuid';
import { AccountsRepository } from './accounts.repository';
import { LolApi } from 'twisted';
import { Regions } from 'twisted/dist/constants';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  LeagueAPI = new LolApi();

  async getAccount(discordId: string): Promise<Account> {
    return this.accountsRepository.findOne({ discordId });
  }

  async getVerifiedAccountBySummonerName(
    summonerName: string,
  ): Promise<Account> {
    return this.accountsRepository.findOne({ summonerName, verified: true });
  }

  async getAccountsBySummonerName(summonerName: string): Promise<Account[]> {
    return this.accountsRepository.findMany({ summonerName });
  }

  async createAccount(
    discordId: string,
    summonerName: string,
  ): Promise<Account> {
    const leagueAccount = await this.LeagueAPI.Summoner.getByName(
      summonerName,
      Regions.EU_WEST,
    );

    return this.accountsRepository.create({
      discordId: discordId,
      summonerName: summonerName,
      summonerId: leagueAccount.response.id,
      uuid: uuidv4(),
      verified: false,
    });
  }

  async updateAccount(
    discordId: string,
    summonerName: string,
  ): Promise<Account> {
    return this.accountsRepository.findOneAndUpdate(
      { discordId: discordId },
      { summonerName: summonerName, uuid: uuidv4(), verified: false },
    );
  }

  async checkVerification(account: Account): Promise<Account> {
    const playerCode = await this.LeagueAPI.ThirdPartyCode.get(
      account.summonerId,
      Regions.EU_WEST,
    );

    const verified = playerCode.response.code === account.uuid;

    return this.accountsRepository.findOneAndUpdate(
      { discordId: account.discordId },
      { verified: verified },
    );
  }
}
