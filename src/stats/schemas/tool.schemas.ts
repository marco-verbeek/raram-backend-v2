import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ToolDocument = Tool & Document;

@Schema()
export class Tool {
  @Prop({ default: 0 })
  gamesAnalyzed: number;
  @Prop({ default: 0 })
  verifiedPlayers: number;
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
