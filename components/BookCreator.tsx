import React, { useState, useCallback } from 'react';
import { MultiFileUpload } from './MultiFileUpload';
import { Loader } from './Loader';
import { BookPreview } from './BookPreview';
import { processDocument } from '../services/geminiService';
import { BookOpenText, ArrowLeft } from './icons';

export type Paper = {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  year: number | null;
  content: string;
  error?: string;
};

export type BookData = {
  title: string;
  subtitle: string;
  author: string;
  publisher: string;
  edition: string;
  preface: string;
  acknowledgment: string;
};

interface BookCreatorProps {
  onBack: () => void;
}

export const BookCreator: React.FC<BookCreatorProps> = ({ onBack }) => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [view, setView] = useState<'upload' | 'processing' | 'preview'>('upload');
  const [error, setError] = useState<string>('');
  
  const [bookData, setBookData] = useState<BookData>({
    title: 'UPSC & MPSC Civil Services Exam – General Studies Paper 1 (2013–2025)',
    subtitle: 'द्विभाषिक (English + Marathi) आवृत्ती',
    author: 'लेखक: विजय पारे',
    publisher: 'प्रकाशित करणारे: vijayshree पब्लिकेशन',
    edition: 'प्रथम आवृत्ती: 2025',
    preface: 'प्रस्तावना (Preface)...',
    acknowledgment: 'आभारप्रदर्शन (Acknowledgment)...'
  });

  const handleFilesSelect = (files: File[]) => {
    const newPapers: Paper[] = files.map(file => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      status: 'pending',
      year: null,
      content: '',
    }));
    setPapers(newPapers);
    setError('');
  };

  const handleProcessClick = useCallback(async () => {
    if (papers.length === 0) {
      setError('Please select at least one file.');
      return;
    }
    if (!process.env.API_KEY) {
      setError('API Key is missing. Please ensure it is configured in your environment.');
      return;
    }

    setView('processing');
    setError('');

    const processingPromises = papers.map(async (paper) => {
      try {
        setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, status: 'processing' } : p));
        const result = await processDocument(paper.file);
        return { ...paper, ...result, status: 'completed' } as Paper;
      } catch (err) {
        console.error(`Error processing ${paper.file.name}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        return { ...paper, status: 'error', error: errorMessage } as Paper;
      }
    });

    const results = await Promise.all(processingPromises);

    const processedPapers = results.map(res => {
        if ('value' in res) { // Check if the promise was fulfilled
            return res.value;
        }
        // This case handles rejected promises, but the try/catch inside should prevent this.
        // It's a fallback. Find the corresponding paper from the original array to mark as error.
        // NOTE: This fallback is imperfect and relies on the order. The try/catch is the primary error handler.
        return { ...papers[results.indexOf(res)], status: 'error', error: 'A critical processing error occurred.' } as Paper;
    });
    
    processedPapers.sort((a, b) => {
        if (a.year === null) return 1;
        if (b.year === null) return -1;
        return a.year - b.year;
    });

    setPapers(processedPapers);
    setView('preview');

  }, [papers]);

  const resetState = () => {
    setPapers([]);
    setView('upload');
    setError('');
  };

  const renderContent = () => {
    switch (view) {
      case 'processing':
        const currentlyProcessing = papers.filter(p => p.status === 'processing').length > 0;
        const processingCount = papers.filter(p => p.status === 'completed' || p.status === 'error').length;
        const subtext = currentlyProcessing ? `Processing paper ${processingCount + 1} of ${papers.length}... This may take some time.` : `Finalizing book...`;
        return <Loader text="Processing Papers..." subtext={subtext} />;
      case 'preview':
        return <BookPreview initialPapers={papers} bookData={bookData} onBookDataChange={setBookData} onReset={resetState} />;
      case 'upload':
      default:
        return (
          <div className="flex flex-col items-center gap-6">
            <MultiFileUpload onFilesSelect={handleFilesSelect} />
            {error && <p className="text-red-500 text-center font-medium -mt-2">{error}</p>}
            <button
              onClick={handleProcessClick}
              disabled={papers.length === 0}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Book
            </button>
          </div>
        );
    }
  };

  return (
     <div className="relative">
        <button onClick={onBack} className="absolute top-0 left-0 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to selection
        </button>
        <div className="text-center mb-8 pt-8">
            <div className="flex justify-center items-center gap-3 mb-2">
                <BookOpenText className="h-10 w-10 text-green-600" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                GS Papers Book Creator
                </h1>
            </div>
            <p className="text-md text-gray-600">
                Upload UPSC GS papers to create a bilingual (English + Marathi) book.
            </p>
        </div>
        <div className="min-h-[400px]">
            {renderContent()}
        </div>
    </div>
  );
};
