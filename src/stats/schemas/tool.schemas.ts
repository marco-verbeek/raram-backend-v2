import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ToolDocument = Tool & Document;

@Schema()
export class Tool {
  @Prop({ default: 0 })
  verifiedPlayers: number;
  @Prop({ default: [], type: [Number] })
  analyzedGameIds: number[];
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
