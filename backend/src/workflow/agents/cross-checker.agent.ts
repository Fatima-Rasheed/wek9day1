import { Injectable } from '@nestjs/common';

interface Summary {
  documentId: string;
  title: string;
  summary: string;
  keyPoints: string[];
}

interface Contradiction {
  statement1: string;
  statement2: string;
  source1: string;
  source2: string;
  type: string;
}

@Injectable()
export class CrossCheckerAgent {
  private antonymPairs = [
    ['better', 'worse'],
    ['faster', 'slower'],
    ['easier', 'harder'],
    ['simple', 'complex'],
    ['efficient', 'inefficient'],
    ['scalable', 'not scalable'],
    ['scales well', 'does not scale'],
    ['good', 'bad'],
    ['advantage', 'disadvantage'],
    ['pro', 'con'],
    ['increase', 'decrease'],
    ['more', 'less'],
    ['high', 'low'],
    ['strong', 'weak'],
    ['consistent', 'inconsistent'],
    ['reliable', 'unreliable'],
  ];

  check(summaries: Summary[]): Contradiction[] {
    const contradictions: Contradiction[] = [];

    // Compare each pair of summaries
    for (let i = 0; i < summaries.length; i++) {
      for (let j = i + 1; j < summaries.length; j++) {
        const conflicts = this.findContradictions(summaries[i], summaries[j]);
        contradictions.push(...conflicts);
      }
    }

    // Limit to most significant contradictions only
    return contradictions.slice(0, 2);
  }

  private findContradictions(
    summary1: Summary,
    summary2: Summary,
  ): Contradiction[] {
    const contradictions: Contradiction[] = [];
    const text1 = summary1.summary.toLowerCase();
    const text2 = summary2.summary.toLowerCase();

    // Only check for strong contradictions (not comparative statements)
    const strongAntonyms = [
      ['consistent', 'inconsistent'],
      ['reliable', 'unreliable'],
      ['scalable', 'not scalable'],
      ['efficient', 'inefficient'],
    ];

    // Check for antonym pairs
    for (const [word1, word2] of strongAntonyms) {
      if (text1.includes(word1) && text2.includes(word2)) {
        // Find the sentences containing these words
        const sentence1 = this.findSentenceWithWord(summary1.keyPoints, word1);
        const sentence2 = this.findSentenceWithWord(summary2.keyPoints, word2);

        if (sentence1 && sentence2) {
          contradictions.push({
            statement1: sentence1,
            statement2: sentence2,
            source1: summary1.title,
            source2: summary2.title,
            type: `${word1} vs ${word2}`,
          });
        }
      }

      // Check reverse
      if (text1.includes(word2) && text2.includes(word1)) {
        const sentence1 = this.findSentenceWithWord(summary1.keyPoints, word2);
        const sentence2 = this.findSentenceWithWord(summary2.keyPoints, word1);

        if (sentence1 && sentence2) {
          contradictions.push({
            statement1: sentence1,
            statement2: sentence2,
            source1: summary1.title,
            source2: summary2.title,
            type: `${word2} vs ${word1}`,
          });
        }
      }
    }

    return contradictions;
  }

  private findSentenceWithWord(
    sentences: string[],
    word: string,
  ): string | null {
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word)) {
        return sentence;
      }
    }
    return null;
  }
}
