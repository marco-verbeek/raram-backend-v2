import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChampionDocument = Champion & Document;

@Schema()
export class Champion {
  @Prop({ unique: true })
  name!: string;

  @Prop({ type: Map, of: [Number], default: [0, 0] })
  players: { type: Map<string, [number, number]>; of: number };

  @Prop({ default: 0 })
  gamesPlayed: number;
  @Prop({ default: 0 })
  gamesWon: number;

  @Prop({ default: 0 })
  totalPointsWon: number;
  @Prop({ default: 0 })
  totalPointsLost: number;

  @Prop({ default: 0 })
  totalKP: number;
  @Prop({ default: 0 })
  doubleKills: number;
  @Prop({ default: 0 })
  tripleKills: number;
  @Prop({ default: 0 })
  quadraKills: number;
  @Prop({ default: 0 })
  pentaKills: number;

  @Prop({ default: 0 })
  totalDamageDone: number;
  @Prop({ default: 0 })
  totalDamageTaken: number;
  @Prop({ default: 0 })
  totalHealed: number;
}

export const ChampionSchema = SchemaFactory.createForClass(Champion);
