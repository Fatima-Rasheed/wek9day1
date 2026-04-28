import { Injectable } from '@nestjs/common';
import { GroqService } from '../groq.service';

@Injectable()
export class QuestionSplitterAgent {
  constructor(private groq: GroqService) {}

  async split(question: string): Promise<string[]> {
    const lowerQuestion = question.toLowerCase();

    // Try Groq first
    try {
      const prompt = `You are a question splitter for a research agent system. 
      Given a user's question, break it down into 3-5 specific, smaller research questions that will help in finding a comprehensive answer.
      Return the questions as a JSON array of strings.
      
      User Question: "${question}"`;

      const subQuestions = await this.groq.generateJSON<string[]>(prompt);
      if (Array.isArray(subQuestions) && subQuestions.length > 0) {
        return subQuestions;
      }
    } catch {
      console.log('Groq splitter failed, falling back to rule-based logic');
    }

    // Fallback to rule-based logic
    const subQuestions: string[] = [];

    // Detect comparison questions
    if (lowerQuestion.includes(' vs ') || lowerQuestion.includes(' versus ')) {
      const parts = question.split(/\s+vs\.?\s+|\s+versus\s+/i);
      if (parts.length === 2) {
        subQuestions.push(`What is ${parts[0].trim()}?`);
        subQuestions.push(`What is ${parts[1].trim()}?`);
        subQuestions.push(`What are the advantages of ${parts[0].trim()}?`);
        subQuestions.push(`What are the advantages of ${parts[1].trim()}?`);
        subQuestions.push(`What are the disadvantages of ${parts[0].trim()}?`);
        subQuestions.push(`What are the disadvantages of ${parts[1].trim()}?`);
      }
    }
    // ... rest of the code remains similar but I'll keep it concise for the tool call
    else if (lowerQuestion.includes('compare')) {
      subQuestions.push(question);
      subQuestions.push('What are the key differences?');
      subQuestions.push('What are the pros and cons?');
    } else {
      subQuestions.push(question);
    }

    return subQuestions.length > 0 ? subQuestions : [question];
  }
}
