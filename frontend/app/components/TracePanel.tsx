'use client';

import { useState } from 'react';
import { Scissors, Search, BarChart3, FileText, AlertTriangle, Microscope, ChevronDown, CheckCircle } from 'lucide-react';

interface Props {
  trace: {
    id: string;
    steps: any;
    contradictions: any[];
  };
}

export default function TracePanel({ trace }: Props) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const steps = [
    {
      id: 'questionSplitter',
      title: '1. Question Splitter',
      Icon: Scissors,
      data: trace.steps.questionSplitter,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 'documentFinder',
      title: '2. Document Finder',
      Icon: Search,
      data: trace.steps.documentFinder,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      id: 'ranker',
      title: '3. Ranker (TF-IDF)',
      Icon: BarChart3,
      data: trace.steps.ranker,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      id: 'summarizer',
      title: '4. Summarizer',
      Icon: FileText,
      data: trace.steps.summarizer,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      id: 'crossChecker',
      title: '5. Cross-Checker',
      Icon: AlertTriangle,
      data: trace.steps.crossChecker,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
  ];

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-indigo-100 dark:border-gray-700 animate-fadeIn">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Microscope className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Workflow Trace
        </h2>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        Click on each step to see how the agents processed your question
      </p>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const { Icon, color, bgColor, borderColor } = step;
          const isExpanded = expandedStep === step.id;
          
          return (
            <div 
              key={step.id} 
              className={`border-2 rounded-xl transition-all duration-300 ${
                isExpanded ? `${borderColor} shadow-lg` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleStep(step.id)}
                className={`w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 flex items-center justify-between transition-all duration-300 rounded-xl ${
                  isExpanded ? bgColor : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span className="flex items-center gap-2 sm:gap-3 lg:gap-4 font-semibold text-gray-800 dark:text-gray-200 flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${bgColor} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg truncate">{step.title}</span>
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400 flex-shrink-0 hidden sm:block" />
                </span>
                <div className={`p-1.5 sm:p-2 rounded-lg transition-transform duration-300 flex-shrink-0 ${
                  isExpanded ? 'rotate-180 bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4 bg-gray-50/50 dark:bg-gray-900/50 border-t-2 border-gray-200 dark:border-gray-700 animate-slideIn">
                  {/* Summary stats for each step */}
                  {step.id === 'questionSplitter' && step.data?.count && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300">
                        Generated {step.data.count} sub-question{step.data.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  
                  {step.id === 'documentFinder' && Array.isArray(step.data) && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <p className="text-xs sm:text-sm font-semibold text-green-900 dark:text-green-300">
                        Found {step.data.reduce((sum: number, r: any) => sum + (r.documentsFound || 0), 0)} total documents across {step.data.length} sub-question{step.data.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  
                  {step.id === 'ranker' && Array.isArray(step.data) && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <p className="text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-300">
                        Ranked and selected top {step.data.reduce((sum: number, r: any) => sum + (r.topDocuments || 0), 0)} documents using TF-IDF algorithm
                      </p>
                    </div>
                  )}
                  
                  {step.id === 'summarizer' && Array.isArray(step.data) && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <p className="text-xs sm:text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                        Generated {step.data.reduce((sum: number, r: any) => sum + (r.summariesGenerated || 0), 0)} AI-powered summaries
                      </p>
                    </div>
                  )}
                  
                  {step.id === 'crossChecker' && step.data?.contradictionsFound !== undefined && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <p className="text-xs sm:text-sm font-semibold text-orange-900 dark:text-orange-300">
                        {step.data.contradictionsFound === 0 
                          ? 'No contradictions detected - all sources are consistent' 
                          : `Detected ${step.data.contradictionsFound} contradiction${step.data.contradictionsFound !== 1 ? 's' : ''} between sources`}
                      </p>
                    </div>
                  )}
                  
                  <pre className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 overflow-auto max-h-64 sm:max-h-96 whitespace-pre-wrap bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 font-mono">
                    {JSON.stringify(step.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {trace.contradictions.length > 0 && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl shadow-lg animate-slideIn">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <h3 className="font-bold text-orange-900 dark:text-orange-300 text-base sm:text-lg">
              {trace.contradictions.length} Contradiction(s) Detected
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
            The cross-checker found conflicting information across sources. See
            the answer above for details.
          </p>
        </div>
      )}
    </div>
  );
}
