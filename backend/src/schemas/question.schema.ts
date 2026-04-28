import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  query: string;

  @Prop({ type: [String], default: [] })
  subQuestions: string[];

  @Prop()
  answerId: string;

  @Prop()
  traceId: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
