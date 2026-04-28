import { Injectable } from '@nestjs/common';
import { GroqService } from '../groq.service';

interface Document {
  id: string;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  tfidfScore?: number;
}

interface Summary {
  documentId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  pros?: string[];
  cons?: string[];
}

@Injectable()
export class SummarizerAgent {
  constructor(private groq: GroqService) {}

  async summarize(
    documents: Document[],
    subQuestion: string,
  ): Promise<Summary[]> {
    const summaries: Summary[] = [];

    for (const doc of documents) {
      try {
        const prompt = `You are a document summarizer for a research system.
        Given a document and a specific sub-question, provide a concise summary (2-3 sentences) that directly addresses the sub-question using the document content.
        Also, extract 3-5 key points as a JSON array.
        
        Sub-question: "${subQuestion}"
        Document Title: "${doc.title}"
        Document Content: "${doc.content}"
        
        Return the result as JSON with fields: "summary" (string) and "keyPoints" (array of strings).`;

        const result = await this.groq.generateJSON<{
          summary: string;
          keyPoints: string[];
        }>(prompt);

        summaries.push({
          documentId: doc.id,
          title: doc.title,
          summary: result.summary,
          keyPoints: result.keyPoints,
          pros: doc.pros,
          cons: doc.cons,
        });
      } catch {
        console.log(
          `Gemini summarization failed for doc ${doc.title}, falling back`,
        );
        // Fallback
        const keyPoints: string[] = [];
        if (doc.pros) doc.pros.forEach((p) => keyPoints.push(`✓ ${p}`));
        if (doc.cons) doc.cons.forEach((c) => keyPoints.push(`✗ ${c}`));

        summaries.push({
          documentId: doc.id,
          title: doc.title,
          summary: doc.content.substring(0, 200) + '...',
          keyPoints:
            keyPoints.length > 0 ? keyPoints : [doc.content.substring(0, 100)],
          pros: doc.pros,
          cons: doc.cons,
        });
      }
    }

    return summaries;
  }
}
