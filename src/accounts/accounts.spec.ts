import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../app.module';
import { DatabaseService } from '../database/database.service';
import { accountStub } from '../database/stubs/account.stub';

describe('AccountsController', () => {
  let app: any;
  let dbConnection: Connection;
  let httpServer: any;

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
  });

  afterAll(async () => {
    await dbConnection.collection('accounts').deleteMany({});
    await app.close();
  });

  describe('getAccount', () => {
    it('should return the stub account', async () => {
      await dbConnection.collection('accounts').insertOne(accountStub());

      const stub = accountStub();
      const response = await request(httpServer).get(
        '/accounts/' + stub.discordId,
      );

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('discordId', stub.discordId);
      expect(response.body).toHaveProperty('summonerName', stub.summonerName);
      expect(response.body).toHaveProperty('verified', stub.verified);
    });
  });
});
