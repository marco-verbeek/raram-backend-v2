import { Injectable } from '@nestjs/common';
import { Account } from './schemas/account.schema';
import { v4 as uuidv4 } from 'uuid';
import { AccountsRepository } from './accounts.repository';
import { LolApi } from 'twisted';
import { RegionGroups, Regions } from 'twisted/dist/constants';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  LeagueAPI = new LolApi();

  async getAccount(discordId: string): Promise<Account> {
    return this.accountsRepository.findOne({ discordId });
  }

  async getFullAccount(discordId: string): Promise<Account> {
    return this.accountsRepository.findOneFull({ discordId });
  }

  async getVerifiedAccountBySummonerName(
    summonerName: string,
  ): Promise<Account> {
    return this.accountsRepository.findVerifiedAccountCaseInsensitive(
      summonerName,
    );
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
      playerUUID: leagueAccount.response.puuid,
      uuid: uuidv4(),
      verified: false,
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

    const matchListing = await this.LeagueAPI.MatchV5.list(
      profile.playerUUID,
      RegionGroups.EUROPE,
      { queue: 450, count: 1 },
    );

    if (matchListing.response.length === 0)
      return {
        error: 'No recent ARAM games found',
      };

    return { matchId: matchListing.response[0] };
  }
}
