import { Injectable } from '@nestjs/common';
import { Account, AccountDocument } from './schemas/account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async findOne(account: Partial<Account>): Promise<Account> {
    return this.accountModel.findOne(account).select('-__v -_id');
  }

  async findVerifiedAccount(discordId: string): Promise<Account> {
    return this.accountModel
      .findOne({ discordId: discordId, verified: true })
      .select('-__v -_id');
  }

  async findVerifiedAccountCaseInsensitive(
    summonerName: string,
  ): Promise<Account> {
    return this.accountModel
      .findOne({
        summonerName: { $regex: '^' + summonerName + '$', $options: 'i' },
        verified: true,
      })
      .select('-__v -_id');
  }

  async findMany(account: Partial<Account>): Promise<Account[]> {
    return this.accountModel.find(account).select('-__v -_id');
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
}
