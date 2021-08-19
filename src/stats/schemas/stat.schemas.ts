import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatDocument = Stat & Document;

@Schema()
export class Stat {
  @Prop({ unique: true })
  discordId!: string;

  @Prop({ default: 0 })
  rankedGames: number;
  @Prop({ default: 0 })
  wins: number;
  @Prop({ default: 0 })
  leaguePoints: number;

  @Prop({ default: 0 })
  doubleKills: number;
  @Prop({ default: 0 })
  tripleKills: number;
  @Prop({ default: 0 })
  quadraKills: number;
  @Prop({ default: 0 })
  pentaKills: number;

  @Prop({ default: 0 })
  goldEarned: number;
  @Prop({ default: 0 })
  goldSpent: number;

  @Prop({ default: 0 })
  damageDealt: number;
  @Prop({ default: 0 })
  damageTaken: number;
  @Prop({ default: 0 })
  healed: number;
}

export const StatSchema = SchemaFactory.createForClass(Stat);
