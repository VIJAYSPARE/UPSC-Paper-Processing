
import React, { useState } from 'react';
import { exportToDocx } from '../utils/docxExporter';
import { Download, Copy, RefreshCw } from './icons';

interface ResultDisplayProps {
  content: string;
  fileName: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, fileName, onReset }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [copyStatus, setCopyStatus] = useState('Copy');
  
  const handleDownload = () => {
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    exportToDocx(editedContent, `${baseName}_processed.docx`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Processed Document</h2>
      
      <div className="relative w-full">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg shadow-inner text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Editable processed content..."
        />
        <button 
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md transition-colors"
          title={copyStatus}
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Download className="h-5 w-5" />
          Download .docx
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          <RefreshCw className="h-5 w-5" />
          Process Another
        </button>
      </div>
    </div>
  );
};
