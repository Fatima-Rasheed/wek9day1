import { Injectable } from '@nestjs/common';

interface Document {
  id: string;
  title: string;
  content: string;
  topic: string;
  tags: string[];
  textScore?: number;
}

interface RankedDocument extends Document {
  tfidfScore: number;
  combinedScore: number;
}

@Injectable()
export class RankerAgent {
  rank(subQuestion: string, documents: Document[]): RankedDocument[] {
    if (documents.length === 0) return [];

    // Calculate TF-IDF scores
    const queryTerms = this.tokenize(subQuestion);
    const docTermFreqs = documents.map((doc) =>
      this.calculateTermFrequency(doc.content),
    );
    const idf = this.calculateIDF(documents.map((d) => d.content));

    const rankedDocs = documents.map((doc, idx) => {
      const tfidfScore = this.calculateTFIDFScore(
        queryTerms,
        docTermFreqs[idx],
        idf,
      );
      const textScore = doc.textScore || 0;

      // Combine TF-IDF with MongoDB text score
      const combinedScore = tfidfScore * 0.7 + textScore * 0.3;

      return {
        ...doc,
        tfidfScore,
        combinedScore,
      };
    });

    // Sort by combined score and return top results
    return rankedDocs
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, 3);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  private calculateTermFrequency(text: string): Map<string, number> {
    const terms = this.tokenize(text);
    const freq = new Map<string, number>();

    terms.forEach((term) => {
      freq.set(term, (freq.get(term) || 0) + 1);
    });

    // Normalize by document length
    const maxFreq = Math.max(...Array.from(freq.values()));
    freq.forEach((count, term) => {
      freq.set(term, count / maxFreq);
    });

    return freq;
  }

  private calculateIDF(documents: string[]): Map<string, number> {
    const idf = new Map<string, number>();
    const totalDocs = documents.length;

    // Count document frequency for each term
    const docFreq = new Map<string, number>();
    documents.forEach((doc) => {
      const uniqueTerms = new Set(this.tokenize(doc));
      uniqueTerms.forEach((term) => {
        docFreq.set(term, (docFreq.get(term) || 0) + 1);
      });
    });

    // Calculate IDF
    docFreq.forEach((freq, term) => {
      idf.set(term, Math.log(totalDocs / freq));
    });

    return idf;
  }

  private calculateTFIDFScore(
    queryTerms: string[],
    docTF: Map<string, number>,
    idf: Map<string, number>,
  ): number {
    let score = 0;

    queryTerms.forEach((term) => {
      const tf = docTF.get(term) || 0;
      const idfValue = idf.get(term) || 0;
      score += tf * idfValue;
    });

    return score;
  }
}
