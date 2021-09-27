import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { accountsStub } from '../database/stubs/accounts.stub';
import { analysisStub } from '../database/stubs/analysis.stub';
import { championStatsStub } from '../database/stubs/champion.stats.stub';
import { playerStatsStub } from '../database/stubs/player.stats.stub';
import { toolStatsStub } from '../database/stubs/tool.stats.stub';
import * as request from 'supertest';

import { AppModule } from '../app.module';
import { DatabaseService } from '../database/database.service';

describe('StatsController', () => {
  let app: any;
  let dbConnection: Connection;
  let httpServer: any;

  const GAME_ID = 'EUW1_5426644723';
  let response;

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
    await dbConnection.collection('tools').insertOne({ analyzedGameIds: [] });
  });

  afterAll(async () => {
    await dbConnection.collection('accounts').deleteMany({});
    await dbConnection.collection('tools').deleteMany({});
    await dbConnection.collection('players').deleteMany({});
    await dbConnection.collection('champions').deleteMany({});

    await app.close();
  });

  describe('Analyzing a game by its id', () => {
    it('should return the correct game analysis data', async () => {
      response = await request(httpServer).get('/analyses/' + GAME_ID);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(analysisStub());
    });

    it('should have incremented tool stats in db', async () => {
      const toolStats = await dbConnection.collection('tools').findOne({});

      expect(toolStats).toHaveProperty(
        'analyzedGameIds',
        toolStatsStub().analyzedGameIds,
      );
    });

    it('should have incremented player stats in db', async () => {
      const playerStats = await dbConnection
        .collection('players')
        .find({})
        .toArray();

      expect(playerStats).toMatchObject(playerStatsStub());
    });

    it('should have incremented champion stats in db', async () => {
      const championStats = await dbConnection
        .collection('champions')
        .find({})
        .toArray();

      expect(championStats).toMatchObject(championStatsStub());
    });
  });

  /**
   * Question: I want to run a GET on /analyses/GAME_ID two times, in order to make sure that data only gets added to the database ONCE.
   * But... I don't want to have the exact same code ran two times, looks redundant. How can I improve this ?
   */

  describe('Analyzing a game that has already been previously analyzed', () => {
    it('should return the correct game analysis data', async () => {
      response = await request(httpServer).get('/analyses/' + GAME_ID);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(analysisStub());
    });

    it('should NOT have incremented tool stats in db', async () => {
      const toolStats = await dbConnection.collection('tools').findOne({});

      expect(toolStats).toHaveProperty(
        'analyzedGameIds',
        toolStatsStub().analyzedGameIds,
      );
    });

    it('should NOT have incremented player stats in db', async () => {
      const playerStats = await dbConnection
        .collection('players')
        .find({})
        .toArray();

      expect(playerStats).toMatchObject(playerStatsStub());
    });

    it('should NOT have incremented champion stats in db', async () => {
      const championStats = await dbConnection
        .collection('champions')
        .find({})
        .toArray();

      expect(championStats).toMatchObject(championStatsStub());
    });
  });
});
