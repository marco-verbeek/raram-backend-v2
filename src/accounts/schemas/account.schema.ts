import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({ unique: true })
  discordId!: string;

  @Prop({ required: true })
  summonerName!: string;

  @Prop({ required: true })
  summonerId!: string;

  @Prop({ required: true })
  encryptedAccountId!: string;

  @Prop({ required: true })
  playerUUID!: string;

  @Prop()
  verified: boolean;

  @Prop({ required: true })
  uuid: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
