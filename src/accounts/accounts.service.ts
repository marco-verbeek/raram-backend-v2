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
    return this.accountsRepository.findOne({
      summonerName: summonerName,
      verified: true,
    });
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
      summonerName: leagueAccount.response.name,
      summonerId: leagueAccount.response.id,
      encryptedAccountId: leagueAccount.response.accountId,
      uuid: uuidv4(),
      verified: false,
      analyzedGameIds: [],
    });
  }

  async updateAccount(
    discordId: string,
    summonerName: string,
  ): Promise<Account> {
    return this.accountsRepository.findOneAndUpdate(discordId, {
      summonerName: summonerName,
      uuid: uuidv4(),
      verified: false,
    });
  }

  async addAnalyzedGameIdToProfile(
    discordId: string,
    gameId: number,
  ): Promise<Account> {
    return this.accountsRepository.addAnalyzedGameId(discordId, gameId);
  }

  async checkVerification(account: Account): Promise<Account> {
    const playerCode = await this.LeagueAPI.ThirdPartyCode.get(
      account.summonerId,
      Regions.EU_WEST,
    );

    const verified = playerCode.response.code === account.uuid;

    return this.accountsRepository.findOneAndUpdate(account.discordId, {
      verified: verified,
    });
  }

  async getLastGameId(discordId: string) {
    const profile = await this.getAccount(discordId);

    if (!profile.verified)
      return {
        error: 'Profile not verified',
      };

    const matchListing = await this.LeagueAPI.Match.list(
      profile.encryptedAccountId,
      Regions.EU_WEST,
      { queue: 450, endIndex: 1 },
    );

    if (matchListing.response.matches.length === 0)
      return {
        error: 'No recent ARAM games found',
      };

    return { matchId: matchListing.response.matches[0].gameId };
  }
}
