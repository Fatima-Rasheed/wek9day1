import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Answer extends Document {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  finalAnswer: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
