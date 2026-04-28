import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentModel } from '../../schemas/document.schema';

@Injectable()
export class DocumentFinderAgent {
  constructor(
    @InjectModel(DocumentModel.name)
    private documentModel: Model<DocumentModel>,
  ) {}

  async findDocuments(subQuestions: string[], uploadedOnly: boolean = false): Promise<any[]> {
    const allDocs: any[] = [];

    for (const subQuestion of subQuestions) {
      // Extract keywords from sub-question
      const keywords = this.extractKeywords(subQuestion);

      // Build query - filter by uploaded tag if specified
      const query: any = { $text: { $search: keywords.join(' ') } };
      if (uploadedOnly) {
        query.tags = 'uploaded';
      }

      // Search using MongoDB text search
      const docs = await this.documentModel
        .find(
          query,
          { score: { $meta: 'textScore' } },
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(10)
        .exec();

      allDocs.push({
        subQuestion,
        documents: docs.map((doc) => ({
          id: doc._id.toString(),
          title: doc.title,
          topic: doc.topic,
          content: doc.content,
          pros: doc.pros,
          cons: doc.cons,
          tags: doc.tags,
          textScore: (doc as unknown as { score?: number }).score || 0,
        })),
      });
    }

    return allDocs;
  }

  private extractKeywords(text: string): string[] {
    // Remove common words and extract meaningful keywords
    const stopWords = new Set([
      'what',
      'is',
      'are',
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'how',
      'when',
      'where',
      'why',
      'which',
      'should',
      'can',
      'does',
      'do',
      'be',
      'been',
      'being',
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));
  }
}
