import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AnalysesModule } from './analyses/analyses.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useFindAndModify: false,
    }),
    UsersModule,
    AnalysesModule,
    AccountsModule,
  ],
})
export class AppModule {}
