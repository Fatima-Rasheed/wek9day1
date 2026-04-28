import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { Question, QuestionSchema } from '../schemas/question.schema';
import { Answer, AnswerSchema } from '../schemas/answer.schema';
import { Trace, TraceSchema } from '../schemas/trace.schema';
import { DocumentModel, DocumentSchema } from '../schemas/document.schema';
import { QuestionSplitterAgent } from './agents/question-splitter.agent';
import { DocumentFinderAgent } from './agents/document-finder.agent';
import { RankerAgent } from './agents/ranker.agent';
import { SummarizerAgent } from './agents/summarizer.agent';
import { CrossCheckerAgent } from './agents/cross-checker.agent';
import { FinalAnswerAgent } from './agents/final-answer.agent';

import { GroqService } from './groq.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: Trace.name, schema: TraceSchema },
      { name: DocumentModel.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    GroqService,
    QuestionSplitterAgent,
    DocumentFinderAgent,
    RankerAgent,
    SummarizerAgent,
    CrossCheckerAgent,
    FinalAnswerAgent,
  ],
})
export class WorkflowModule {}
