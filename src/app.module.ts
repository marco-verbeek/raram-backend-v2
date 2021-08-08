import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Marco:AqzFIG07eWXBJTE8@raram-backend.lrxzg.mongodb.net/db?retryWrites=true&w=majority',
    ),
    UsersModule,
  ],
})
export class AppModule {}
