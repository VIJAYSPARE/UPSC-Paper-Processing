
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { processDocument } from './services/geminiService';
import { BookOpenText } from './components/icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedContent, setProcessedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setProcessedContent('');
    setError('');
  };
  
  const handleProcessClick = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setProcessedContent('');

    try {
      const result = await processDocument(file);
      setProcessedContent(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing the document. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [file]);
  
  const resetState = () => {
    setFile(null);
    setProcessedContent('');
    setIsLoading(false);
    setError('');
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            <BookOpenText className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              UPSC Paper Processor
            </h1>
          </div>
          <p className="text-md text-gray-600">
            Translate UPSC GS papers from Hindi to Marathi while keeping English content intact.
          </p>
        </header>

        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
          {!processedContent && !isLoading && (
             <div className="flex flex-col items-center gap-6">
              <FileUpload onFileSelect={handleFileSelect} fileName={fileName} />
              <button
                onClick={handleProcessClick}
                disabled={!file || isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Process Paper
              </button>
            </div>
          )}

          {isLoading && <Loader />}
          
          {error && <p className="text-red-500 text-center font-medium mt-4">{error}</p>}

          {processedContent && (
            <ResultDisplay content={processedContent} fileName={fileName} onReset={resetState} />
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Vijayshree Publication Book Project. Powered by Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
