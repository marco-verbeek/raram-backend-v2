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
  playerUUID!: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ required: true })
  uuid: string;

  @Prop({ default: false })
  inQueue?: boolean;

  @Prop()
  queueLast?: number;

  @Prop()
  lastAnalyzedGameId?: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
