import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../schemas/question.schema';
import { Answer } from '../schemas/answer.schema';
import { Trace } from '../schemas/trace.schema';
import { QuestionSplitterAgent } from './agents/question-splitter.agent';
import { DocumentFinderAgent } from './agents/document-finder.agent';
import { RankerAgent } from './agents/ranker.agent';
import { SummarizerAgent } from './agents/summarizer.agent';
import { CrossCheckerAgent } from './agents/cross-checker.agent';
import { FinalAnswerAgent } from './agents/final-answer.agent';

interface Summary {
  documentId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  pros?: string[];
  cons?: string[];
}

interface DocumentResult {
  subQuestion: string;
  documents: any[];
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    @InjectModel(Trace.name) private traceModel: Model<Trace>,
    private questionSplitter: QuestionSplitterAgent,
    private documentFinder: DocumentFinderAgent,
    private ranker: RankerAgent,
    private summarizer: SummarizerAgent,
    private crossChecker: CrossCheckerAgent,
    private finalAnswerMaker: FinalAnswerAgent,
  ) {}

  async processQuestion(query: string, uploadedOnly: boolean = false) {
    // Step 1: Split question
    const subQuestions = await this.questionSplitter.split(query);

    // Step 2: Find documents (filter by uploaded if specified)
    const documentResults =
      await this.documentFinder.findDocuments(subQuestions, uploadedOnly);

    // Check if any documents were found
    const totalDocuments = documentResults.reduce(
      (sum, result) => sum + result.documents.length,
      0,
    );

    if (totalDocuments === 0) {
      // No documents found - return early with "information not provided" message
      const question = await this.questionModel.create({
        query,
        subQuestions,
      });

      const noInfoAnswer =
        'Information is not provided in the available documents.';

      const answer = await this.answerModel.create({
        questionId: question._id.toString(),
        finalAnswer: noInfoAnswer,
        metadata: {
          sources: [],
          contradictionCount: 0,
        },
      });

      const trace = await this.traceModel.create({
        questionId: question._id.toString(),
        steps: {
          questionSplitter: {
            subQuestions,
            count: subQuestions.length,
          },
          documentFinder: documentResults.map((result) => ({
            subQuestion: result.subQuestion,
            documentsFound: 0,
            documents: [],
          })),
          ranker: [],
          summarizer: [],
          crossChecker: {
            contradictionsFound: 0,
            contradictions: [],
          },
          finalAnswer: {
            answer: noInfoAnswer,
            sourcesUsed: 0,
            sources: [],
            contradictionsAddressed: 0,
          },
        },
        contradictions: [],
      });

      question.answerId = answer._id.toString();
      question.traceId = trace._id.toString();
      await question.save();

      return {
        questionId: question._id.toString(),
        answer: noInfoAnswer,
        trace: {
          id: trace._id.toString(),
          steps: trace.steps,
          contradictions: [],
        },
      };
    }

    // Step 3: Rank documents
    const rankedResults = documentResults.map((result: DocumentResult) => ({
      subQuestion: result.subQuestion,
      rankedDocuments: this.ranker.rank(result.subQuestion, result.documents),
    }));

    // Step 4: Summarize top documents
    const summariesBySubQuestion = new Map<string, Summary[]>();
    for (const result of rankedResults) {
      const summaries = (await this.summarizer.summarize(
        result.rankedDocuments,
        result.subQuestion,
      )) as Summary[];
      summariesBySubQuestion.set(result.subQuestion, summaries);
    }

    // Step 5: Cross-check for contradictions
    const allSummaries: Summary[] = Array.from(
      summariesBySubQuestion.values(),
    ).flat();
    const contradictions = this.crossChecker.check(allSummaries);

    // Step 6: Compose final answer
    const finalResult = await this.finalAnswerMaker.compose(
      query,
      subQuestions,
      summariesBySubQuestion,
      contradictions,
    );

    // Save to database
    const question = await this.questionModel.create({
      query,
      subQuestions,
    });

    const answer = await this.answerModel.create({
      questionId: question._id.toString(),
      finalAnswer: finalResult.answer,
      metadata: {
        sources: finalResult.sources,
        contradictionCount: contradictions.length,
      },
    });

    const trace = await this.traceModel.create({
      questionId: question._id.toString(),
      steps: {
        questionSplitter: { 
          subQuestions,
          count: subQuestions.length 
        },
        documentFinder: documentResults.map(result => ({
          subQuestion: result.subQuestion,
          documentsFound: result.documents.length,
          documents: result.documents
        })),
        ranker: rankedResults.map(result => ({
          subQuestion: result.subQuestion,
          topDocuments: result.rankedDocuments.length,
          rankedDocuments: result.rankedDocuments
        })),
        summarizer: Array.from(summariesBySubQuestion.entries()).map(
          ([sq, sums]) => ({
            subQuestion: sq,
            summariesGenerated: sums.length,
            summaries: sums,
          }),
        ),
        crossChecker: { 
          contradictionsFound: contradictions.length,
          contradictions 
        },
        finalAnswer: {
          answer: finalResult.answer,
          sourcesUsed: finalResult.sources.length,
          sources: finalResult.sources,
          contradictionsAddressed: finalResult.contradictions.length
        },
      },
      contradictions,
    });

    // Update question with references
    question.answerId = answer._id.toString();
    question.traceId = trace._id.toString();
    await question.save();

    return {
      questionId: question._id.toString(),
      answer: finalResult.answer,
      trace: {
        id: trace._id.toString(),
        steps: trace.steps,
        contradictions: trace.contradictions,
      },
    };
  }

  async getTrace(traceId: string) {
    return this.traceModel.findById(traceId).exec();
  }
}
