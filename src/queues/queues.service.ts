import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LolApi } from 'twisted';
import { Regions } from 'twisted/dist/constants';

@Injectable()
export class QueuesService {
  constructor(private readonly configService: ConfigService) {}
  LeagueAPI = new LolApi();

  async canQueue(summonerId: string): Promise<boolean> {
    try {
      const activeGame = await this.LeagueAPI.Spectator.activeGame(
        summonerId,
        Regions.EU_WEST,
      );

      if (this.configService.get<string>('NODE_ENV') === 'development')
        console.log('Found an active game during Queue check', activeGame);

      return false;
    } catch (ex) {
      return ex.status === 404;
    }
  }
}
