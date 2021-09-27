import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { accountsStub } from '../database/stubs/accounts.stub';
import { LeaderboardDto } from './dto/leaderboard.dto';
import { leaderboardPlayerStatsStub } from '../database/stubs/leaderboards.player.stats.stub';
import { leaderboardsStub } from '../database/stubs/leaderboards.stub';

import { AppModule } from '../app.module';
import { DatabaseService } from '../database/database.service';
import * as request from 'supertest';

describe('StatsController', () => {
  let app: any;
  let dbConnection: Connection;
  let httpServer: any;
  let response: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDatabaseHandle();

    httpServer = app.getHttpServer();

    await dbConnection.collection('accounts').insertMany(accountsStub());
    await dbConnection
      .collection('players')
      .insertMany(leaderboardPlayerStatsStub());
  });

  afterAll(async () => {
    await dbConnection.collection('accounts').deleteMany({});
    await dbConnection.collection('players').deleteMany({});

    await app.close();
  });

  describe('GET /leaderboards', () => {
    it('should have a status code of 200', async () => {
      response = await request(httpServer).get('/leaderboards');

      expect(response.status).toBe(200);
    });

    it('should have the correct data ranked by LP', () => {
      expect(response.body).toHaveProperty(
        'highestRanking',
        leaderboardsStub().highestRanking,
      );
    });

    it('should have the correct data ranked by winrate', () => {
      expect(response.body).toHaveProperty(
        'highestWinrate',
        leaderboardsStub().highestWinrate,
      );
    });

    it('should have the correct data ranked by pentakills', () => {
      expect(response.body).toHaveProperty(
        'highestPentaKills',
        leaderboardsStub().highestPentaKills,
      );
    });

    it('should have the correct data ranked by deaths', () => {
      expect(response.body).toHaveProperty(
        'lowestAvgDeaths',
        leaderboardsStub().lowestAvgDeaths,
      );
    });

    it('should have the correct data ranked by average win LP', () => {
      expect(response.body).toHaveProperty(
        'highestAvgWinLP',
        leaderboardsStub().highestAvgWinLP,
      );
    });

    it('should have the correct data ranked by average KP', () => {
      expect(response.body).toHaveProperty(
        'highestAvgKP',
        leaderboardsStub().highestAvgKP,
      );
    });
  });
});
