import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Trace extends Document {
  @Prop({ required: true })
  questionId: string;

  @Prop({ type: Object, required: true })
  steps: {
    questionSplitter?: {
      subQuestions: string[];
      count: number;
    };
    documentFinder?: Array<{
      subQuestion: string;
      documentsFound: number;
      documents: any[];
    }>;
    ranker?: Array<{
      subQuestion: string;
      topDocuments: number;
      rankedDocuments: any[];
    }>;
    summarizer?: Array<{
      subQuestion: string;
      summariesGenerated: number;
      summaries: any[];
    }>;
    crossChecker?: {
      contradictionsFound: number;
      contradictions: any[];
    };
    finalAnswer?: {
      answer: string;
      sourcesUsed: number;
      sources: string[];
      contradictionsAddressed: number;
    };
  };

  @Prop({ type: [Object], default: [] })
  contradictions: Array<{
    statement1: string;
    statement2: string;
    source1: string;
    source2: string;
  }>;
}

export const TraceSchema = SchemaFactory.createForClass(Trace);
