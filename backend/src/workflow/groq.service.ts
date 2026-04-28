import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private groq: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY || '';
    this.groq = new Groq({ apiKey });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      if (
        !process.env.GROQ_API_KEY ||
        process.env.GROQ_API_KEY === 'your_groq_api_key_here'
      ) {
        return 'Error: Groq API Key not configured. Please add GROQ_API_KEY to your backend/.env file.';
      }
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return `Error generating content: ${errorMessage}`;
    }
  }

  async generateJSON<T>(prompt: string): Promise<T> {
    try {
      if (
        !process.env.GROQ_API_KEY ||
        process.env.GROQ_API_KEY === 'your_groq_api_key_here'
      ) {
        throw new Error('Groq API Key not configured');
      }
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt + '\n\nIMPORTANT: Return ONLY valid JSON.',
          },
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });
      const text = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Groq JSON Error:', error);
      throw error;
    }
  }
}
