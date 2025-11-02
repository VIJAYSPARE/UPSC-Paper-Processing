import React, { useState, useEffect, useRef } from 'react';
import { exportToDocx } from '../utils/docxExporter';
import { exportToPdf } from '../utils/pdfExporter';
import { Download, RefreshCw, GripVertical, FileText } from './icons';
// Fix: Corrected import path for types from `./BookCreator` instead of `../App`.
import { Paper, BookData } from './BookCreator';

interface BookPreviewProps {
  initialPapers: Paper[];
  bookData: BookData;
  onBookDataChange: (data: BookData) => void;
  onReset: () => void;
}

export const BookPreview: React.FC<BookPreviewProps> = ({ initialPapers, bookData, onBookDataChange, onReset }) => {
  const [papers, setPapers] = useState(initialPapers);
  const [draggedItem, setDraggedItem] = useState<Paper | null>(null);

  useEffect(() => {
    setPapers(initialPapers);
  }, [initialPapers]);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, item: Paper) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetItem: Paper) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;
    
    const currentIndex = papers.findIndex(p => p.id === draggedItem.id);
    const targetIndex = papers.findIndex(p => p.id === targetItem.id);

    const newPapers = [...papers];
    const [removed] = newPapers.splice(currentIndex, 1);
    newPapers.splice(targetIndex, 0, removed);
    setPapers(newPapers);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleInputChange = (field: keyof BookData, value: string) => {
    onBookDataChange({ ...bookData, [field]: value });
  };
  
  const handleDownloadDocx = () => {
    exportToDocx(bookData, papers, 'UPSC_GS_Book.docx');
  };

  const handleDownloadPdf = () => {
    exportToPdf(bookData, papers, 'UPSC_GS_Book.pdf');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: Paper List */}
      <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Papers Order (Drag to Reorder)</h3>
        <ul className="space-y-2">
          {papers.map((paper) => (
            <li
              key={paper.id}
              draggable
              onDragStart={(e) => handleDragStart(e, paper)}
              onDragOver={(e) => handleDragOver(e, paper)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-2 rounded-md border cursor-grab transition-shadow ${draggedItem?.id === paper.id ? 'shadow-lg bg-blue-100' : 'bg-white'}`}
            >
              <GripVertical className="h-5 w-5 text-gray-400"/>
              <FileText className="h-5 w-5 text-blue-500" />
              <div className="flex-grow">
                 <p className="text-sm font-medium text-gray-700">{paper.file.name}</p>
                 <p className="text-xs text-gray-500">Detected Year: {paper.year || 'N/A'}</p>
                 {paper.status === 'error' && <p className="text-xs text-red-500">Processing Failed</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column: Book Editor */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Book Preview & Editor</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title Page Content</label>
                <textarea
                    value={`${bookData.title}\n${bookData.subtitle}\n${bookData.author}\n${bookData.publisher}\n${bookData.edition}`}
                    readOnly
                    className="w-full h-36 p-2 border border-gray-300 rounded-lg shadow-inner text-sm font-mono bg-gray-50"
                />
            </div>
             <div>
                <label htmlFor="preface" className="block text-sm font-medium text-gray-700 mb-1">Preface</label>
                <textarea
                    id="preface"
                    value={bookData.preface}
                    onChange={(e) => handleInputChange('preface', e.target.value)}
                    className="w-full h-40 p-2 border border-gray-300 rounded-lg shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>
             <div>
                <label htmlFor="acknowledgment" className="block text-sm font-medium text-gray-700 mb-1">Acknowledgment</label>
                <textarea
                    id="acknowledgment"
                    value={bookData.acknowledgment}
                    onChange={(e) => handleInputChange('acknowledgment', e.target.value)}
                    className="w-full h-40 p-2 border border-gray-300 rounded-lg shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
                onClick={handleDownloadDocx}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <Download className="h-5 w-5" />
                Download .docx
            </button>
            <button
                onClick={handleDownloadPdf}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                <Download className="h-5 w-5" />
                Download .pdf
            </button>
            <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
                <RefreshCw className="h-5 w-5" />
                Start New Book
            </button>
        </div>
      </div>
    </div>
  );
};