import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChampionDocument = Champion & Document;

@Schema()
export class Champion {
  @Prop({ unique: true })
  name!: string;

  @Prop()
  players: { type: Map<string, number>; of: number };

  @Prop({ default: 0 })
  gamesPlayed: number;
  @Prop({ default: 0 })
  gamesWon: number;

  @Prop({ default: 0 })
  pentas: number;
  @Prop({ default: 0 })
  totalKP: number;
}

export const ChampionSchema = SchemaFactory.createForClass(Champion);
