import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DocumentModel extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  pros: string[];

  @Prop({ type: [String], default: [] })
  cons: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  createdAt: string;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);

DocumentSchema.index({ content: 'text', title: 'text', tags: 'text' });
