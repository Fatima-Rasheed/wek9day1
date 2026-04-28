'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import QuestionInput from './components/QuestionInput';
import AnswerDisplay from './components/AnswerDisplay';
import TracePanel from './components/TracePanel';
import ThemeToggle from './components/ThemeToggle';
import DocumentUpload from './components/DocumentUpload';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedOnly, setUploadedOnly] = useState(false);

  const handleAsk = async (question: string) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, uploadedOnly }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process question. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-4 sm:mb-6">
          <DocumentUpload />
          <ThemeToggle />
        </nav>

        <header className="text-center mb-8 sm:mb-12 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
            <div className="relative">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-indigo-600 dark:text-indigo-400" />
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Mini Research Team
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Ask a question and watch our AI agents work together to find the answer
          </p>
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>6 AI Agents Active</span>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto">
          <QuestionInput onAsk={handleAsk} loading={loading} />

          {/* Toggle for uploaded documents only */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
              <input
                type="checkbox"
                checked={uploadedOnly}
                onChange={(e) => setUploadedOnly(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Search only in uploaded documents
              </span>
            </label>
          </div>

          {loading && (
            <div className="mt-6 sm:mt-8 text-center animate-fadeIn">
              <div className="inline-flex flex-col items-center gap-3 sm:gap-4 p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-200 dark:border-indigo-900"></div>
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Processing your question...</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">AI agents are analyzing and researching</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 animate-fadeIn">
              <AnswerDisplay answer={result.answer} />
              <TracePanel trace={result.trace} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
