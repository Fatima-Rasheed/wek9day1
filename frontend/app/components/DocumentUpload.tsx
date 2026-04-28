'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  onUploadSuccess?: () => void;
}

export default function DocumentUpload({ onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage({ type: 'error', text: 'Only PDF, DOCX, and TXT files are allowed' });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 10MB' });
        return;
      }
      setFile(selectedFile);
      setMessage(null);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (topic) formData.append('topic', topic);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Document uploaded successfully!' });
        setFile(null);
        setTitle('');
        setTopic('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess?.();
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload document. Make sure the backend is running.' });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base"
      >
        <Upload className="w-4 h-4" />
        <span>Upload Document</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Upload Document
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select File (PDF, DOCX, TXT)
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-900"
                  >
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {file ? file.name : 'Choose a file...'}
                    </span>
                  </label>
                  {file && (
                    <button
                      onClick={clearFile}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document title..."
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Topic (Optional)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Technology, Business..."
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
