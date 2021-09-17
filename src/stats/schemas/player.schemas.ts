import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop({ unique: true })
  discordId!: string;

  @Prop({ default: 0 })
  rankedGames: number;
  @Prop({ default: 0 })
  wins: number;
  @Prop({ default: 0 })
  leaguePoints: number;

  @Prop({ default: 0 })
  goldEarned: number;
  @Prop({ default: 0 })
  goldSpent: number;

  @Prop({ default: 0 })
  kills: number;
  @Prop({ default: 0 })
  deaths: number;
  @Prop({ default: 0 })
  assists: number;

  @Prop({ default: 0 })
  firstBloods: number;
  @Prop({ default: 0 })
  firstBloodAssists: number;

  @Prop({ default: 0 })
  doubleKills: number;
  @Prop({ default: 0 })
  tripleKills: number;
  @Prop({ default: 0 })
  quadraKills: number;
  @Prop({ default: 0 })
  pentaKills: number;

  @Prop({ default: 0 })
  damageDealt: number;
  @Prop({ default: 0 })
  damageTaken: number;
  @Prop({ default: 0 })
  healed: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
