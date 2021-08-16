import { Injectable } from '@nestjs/common';
import { Account, AccountDocument } from './schemas/account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async findOne(accountFilterQuery: FilterQuery<Account>): Promise<Account> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.accountModel.findOne(accountFilterQuery).select('-__v -_id');
  }

  async findMany(accountFilterQuery: FilterQuery<Account>): Promise<Account[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.accountModel.find(accountFilterQuery).select('-__v -_id');
  }

  create(account: Account): Promise<Account> {
    const newUser = new this.accountModel(account);
    return newUser.save();
  }

  async findOneAndUpdate(
    discordId: string,
    account: Partial<Account>,
  ): Promise<Account> {
    return this.accountModel
      .findOneAndUpdate({ discordId: discordId }, account, {
        new: true,
      })
      .select('-__v -_id');
  }

  async addAnalyzedGameId(discordId: string, gameId: number): Promise<Account> {
    return this.accountModel
      .findOneAndUpdate(
        { discordId: discordId },
        { $push: { analyzedGameIds: gameId } },
        { new: true },
      )
      .select('-__v -_id');
  }
}
