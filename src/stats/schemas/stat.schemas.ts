import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Stat {
  @Prop({ unique: true })
  discordId!: string;

  @Prop()
  rankedGames: number;

  @Prop()
  doubleKills: number;
  @Prop()
  tripleKills: number;
  @Prop()
  quadraKills: number;
  @Prop()
  pentaKills: number;

  @Prop()
  goldEarned: number;
  @Prop()
  goldSpent: number;

  @Prop()
  timeSpentAlive: number;
}
