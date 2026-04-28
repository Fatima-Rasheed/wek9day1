'use client';

import { useState } from 'react';
import { Send, Lightbulb } from 'lucide-react';

interface Props {
  onAsk: (question: string) => void;
  loading: boolean;
}

const exampleQuestions = [
  'Compare SQL vs NoSQL databases',
  'What are the benefits of microservices?',
  'Explain REST API best practices',
];

export default function QuestionInput({ onAsk, loading }: Props) {
  const [question, setQuestion] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAsk(question);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-indigo-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      <form onSubmit={handleSubmit}>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
          <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
          Your Question
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask anything..."
              className={`w-full px-4 py-3 sm:px-5 sm:py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base ${
                isFocused ? 'border-indigo-400 dark:border-indigo-500 shadow-lg' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group text-sm sm:text-base whitespace-nowrap"
          >
            <span>Ask</span>
            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Example questions */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Try:</span>
          {exampleQuestions.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExampleClick(example)}
              disabled={loading}
              className="text-xs px-2.5 py-1.5 sm:px-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
