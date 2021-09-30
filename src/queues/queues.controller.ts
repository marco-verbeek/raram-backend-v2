import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AnalysesService } from 'src/analyses/analyses.service';
import { AccountsService } from '../accounts/accounts.service';
import { QueuesService } from './queues.service';

@Controller('queues')
export class QueuesController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly queuesService: QueuesService,
    private readonly analysesService: AnalysesService,
  ) {}

  @Get()
  async queueCore() {
    const accountsInQueue = await this.accountsService.getAccountsInQueue();
    if (accountsInQueue.length === 0) return;

    for (const account of accountsInQueue) {
      const lastGameReq = await this.accountsService.getLastGameId(
        account.discordId,
      );

      const gameIdFromRegionalString = parseInt(
        lastGameReq.matchId.split('_')[1],
      );

      if (
        account.lastAnalyzedGameId === undefined ||
        gameIdFromRegionalString !== account.lastAnalyzedGameId
      ) {
        this.analysesService.analyseGameWithId(lastGameReq.matchId);
      }
    }
  }

  @Get('/start/:discordId')
  async startQueue(@Param('discordId') discordId: string) {
    const account = await this.accountsService.getFullAccount(discordId);

    if (!account)
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);

    if (!account.verified)
      throw new HttpException(
        'Account not verified',
        HttpStatus.METHOD_NOT_ALLOWED,
      );

    if (!this.queuesService.canQueue(account.summonerId))
      throw new HttpException('Already in game', HttpStatus.METHOD_NOT_ALLOWED);

    if (account.inQueue)
      throw new HttpException(
        'Already in queue',
        HttpStatus.METHOD_NOT_ALLOWED,
      );

    return await this.accountsService.updateQueue(discordId, true);
  }

  @Get('/stop/:discordId')
  async stopQueue(@Param('discordId') discordId: string) {
    const account = await this.accountsService.getAccount(discordId);

    if (!account)
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);

    if (!account.verified)
      throw new HttpException(
        'Account not verified',
        HttpStatus.METHOD_NOT_ALLOWED,
      );

    if (!this.queuesService.canQueue(account.summonerId))
      throw new HttpException('Already in game', HttpStatus.METHOD_NOT_ALLOWED);

    if (!account.inQueue)
      throw new HttpException('Not in queue', HttpStatus.METHOD_NOT_ALLOWED);

    const lastGameReq = await this.accountsService.getLastGameId(discordId);
    if (lastGameReq !== undefined && lastGameReq.matchId)
      await this.analysesService.analyseGameWithId(lastGameReq.matchId);

    return await this.accountsService.updateQueue(discordId, false);
  }
}
