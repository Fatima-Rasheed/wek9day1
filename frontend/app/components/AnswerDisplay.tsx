'use client';

import { CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';

interface Props {
  answer: string;
}

export default function AnswerDisplay({ answer }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown-style answer
  const renderAnswer = () => {
    const lines = answer.split('\n');
    
    return lines.map((line, idx) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4 sm:mb-6 animate-slideIn">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-base sm:text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200 animate-slideIn">
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-semibold mt-5 sm:mt-6 mb-2 sm:mb-3 text-gray-800 dark:text-gray-200 animate-slideIn">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        const text = line.substring(3);
        const isWarning = text.includes('⚠️');
        return (
          <h2
            key={idx}
            className={`text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4 flex items-center gap-2 animate-slideIn ${
              isWarning ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-gray-200'
            }`}
          >
            {text}
          </h2>
        );
      } else if (line.startsWith('**Pros:**')) {
        return (
          <div key={idx} className="mt-4 sm:mt-6 mb-2 sm:mb-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 dark:border-green-400 animate-slideIn">
            <h3 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">✓</span> Pros
            </h3>
          </div>
        );
      } else if (line.startsWith('**Cons:**')) {
        return (
          <div key={idx} className="mt-4 sm:mt-6 mb-2 sm:mb-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 dark:border-red-400 animate-slideIn">
            <h3 className="text-base sm:text-lg font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">✗</span> Cons
            </h3>
          </div>
        );
      } else if (line.startsWith('- ✓ ')) {
        return (
          <li key={idx} className="ml-4 sm:ml-6 mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 flex items-start gap-2 sm:gap-3 p-2 hover:bg-green-50 dark:hover:bg-green-900/10 rounded transition-colors">
            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base sm:text-lg">✓</span>
            <span className="flex-1">{line.substring(4)}</span>
          </li>
        );
      } else if (line.startsWith('- ✗ ')) {
        return (
          <li key={idx} className="ml-4 sm:ml-6 mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 flex items-start gap-2 sm:gap-3 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors">
            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base sm:text-lg">✗</span>
            <span className="flex-1">{line.substring(4)}</span>
          </li>
        );
      } else if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 sm:ml-6 mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors">
            {line.substring(2)}
          </li>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={idx} className="font-bold text-gray-900 dark:text-gray-100 mt-4 sm:mt-6 mb-2 sm:mb-3 text-lg sm:text-xl flex items-center gap-2">
            <span className="w-1 h-5 sm:h-6 bg-indigo-600 dark:bg-indigo-400 rounded"></span>
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (line.trim()) {
        return (
          <p key={idx} className="text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base lg:text-lg">
            {line}
          </p>
        );
      }
      return <br key={idx} />;
    });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-indigo-100 dark:border-gray-700 animate-fadeIn">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Answer</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors whitespace-nowrap"
        >
          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          <span className="sm:hidden">{copied ? '✓' : 'Copy'}</span>
        </button>
      </div>
      <div className="prose max-w-none">{renderAnswer()}</div>
    </div>
  );
}
