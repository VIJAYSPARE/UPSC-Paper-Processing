import React, { useState } from 'react';
import { BookCreator } from './components/BookCreator';
import { SinglePaperProcessor } from './components/SinglePaperProcessor';
import { BookOpenText, FileText } from './components/icons';

const App: React.FC = () => {
  const [mode, setMode] = useState<'select' | 'processor' | 'creator'>('select');

  const ModeSelector = () => (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
      <div
        className="flex flex-col items-center justify-center w-64 h-64 p-6 bg-white rounded-xl shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
        onClick={() => setMode('processor')}
      >
        <FileText className="h-16 w-16 text-blue-600 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 text-center">UPSC Paper Processor</h2>
        <p className="text-sm text-gray-600 text-center mt-2">Process a single paper from Hindi to Marathi.</p>
      </div>
      <div
        className="flex flex-col items-center justify-center w-64 h-64 p-6 bg-white rounded-xl shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1"
        onClick={() => setMode('creator')}
      >
        <BookOpenText className="h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 text-center">GS Papers Book Creator</h2>
        <p className="text-sm text-gray-600 text-center mt-2">Compile multiple papers into a complete book.</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'processor':
        return <SinglePaperProcessor onBack={() => setMode('select')} />;
      case 'creator':
        return <BookCreator onBack={() => setMode('select')} />;
      case 'select':
      default:
        return <ModeSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Vijayshree Publication Tools
            </h1>
          </div>
          <p className="text-md text-gray-600">
            Process single papers or create complete books for UPSC/MPSC aspirants.
          </p>
        </header>
        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 min-h-[500px] flex flex-col justify-center">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Vijayshree Publication Project. Powered by Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
