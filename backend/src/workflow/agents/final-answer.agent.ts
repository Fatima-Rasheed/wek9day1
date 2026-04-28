import { Injectable } from '@nestjs/common';
import { GroqService } from '../groq.service';

interface Summary {
  documentId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  pros?: string[];
  cons?: string[];
}

interface Contradiction {
  statement1: string;
  statement2: string;
  source1: string;
  source2: string;
  type: string;
}

interface FinalAnswer {
  answer: string;
  sources: string[];
  contradictions: Array<{
    statement1: string;
    statement2: string;
    source1: string;
    source2: string;
    type: string;
  }>;
}

@Injectable()
export class FinalAnswerAgent {
  constructor(private groq: GroqService) {}

  async compose(
    originalQuestion: string,
    subQuestions: string[],
    summariesBySubQuestion: Map<string, Summary[]>,
    contradictions: Contradiction[],
  ): Promise<FinalAnswer> {
    const allSummaries: Summary[] = [];
    summariesBySubQuestion.forEach((summaries) =>
      allSummaries.push(...summaries),
    );

    const sources = Array.from(new Set(allSummaries.map((s) => s.title)));

    try {
      const summaryContext = Array.from(summariesBySubQuestion.entries())
        .map(([sq, summaries]) => {
          return `Sub-question: ${sq}\n${summaries.map((s) => {
            let text = `- Source (${s.title}): ${s.summary}`;
            if (s.pros && s.pros.length > 0) {
              text += `\n  Pros: ${s.pros.join(', ')}`;
            }
            if (s.cons && s.cons.length > 0) {
              text += `\n  Cons: ${s.cons.join(', ')}`;
            }
            return text;
          }).join('\n')}`;
        })
        .join('\n\n');

      const prompt = `You are a research assistant. Your task is to provide a CONCISE, well-structured answer to the user's question based STRICTLY on the provided summaries and sub-questions.
      
      User's Original Question: "${originalQuestion}"
      
      Context from Research:
      ${summaryContext}
      
      Contradictions Found:
      ${contradictions.map((c) => `- ${c.source1} says: "${c.statement1}" BUT ${c.source2} says: "${c.statement2}"`).join('\n')}
      
      CRITICAL INSTRUCTIONS:
      1. You MUST ONLY use information from the "Context from Research" section above.
      2. DO NOT use your internal knowledge or any information outside the provided context.
      3. If the context doesn't provide enough information to answer the question, you MUST respond with: "Information is not provided in the available documents."
      4. Keep the answer SHORT and CONCISE (3-5 paragraphs maximum).
      5. Use Markdown for formatting (headings, lists, bold text).
      6. ALWAYS include a "Pros and Cons" section at the end if pros/cons are available in the sources.
      7. Organize the answer logically, addressing each part of the original question.
      8. If contradictions were found, briefly mention them in the answer.
      9. The answer should be professional, informative, and BRIEF.
      
      Return ONLY the markdown text of the answer.`;

      const answer = await this.groq.generateContent(prompt);

      return {
        answer,
        sources,
        contradictions,
      };
    } catch {
      console.error('Groq composition failed, falling back to rule-based');
      // Fallback
      let answer = `# ${originalQuestion}\n\n`;
      subQuestions.forEach((subQ) => {
        const summaries = summariesBySubQuestion.get(subQ) || [];
        if (summaries.length > 0) {
          answer += `## ${subQ}\n\n`;
          summaries.forEach((s) => {
            answer += `**${s.title}**\n${s.summary}\n\n`;
          });
        }
      });
      return { answer, sources, contradictions };
    }
  }
}
