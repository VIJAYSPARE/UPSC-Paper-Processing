import React from 'react';
import { exportSingleDocx } from '../utils/docxExporter';
import { Download, RefreshCw } from './icons';

interface ResultDisplayProps {
  content: string;
  fileName: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, fileName, onReset }) => {
    const handleDownload = () => {
        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        exportSingleDocx(content, `${baseName}_processed.docx`);
    };

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full">
                <label htmlFor="result-content" className="block text-sm font-medium text-gray-700 mb-1">
                    Processed Content
                </label>
                <textarea
                    id="result-content"
                    readOnly
                    value={content}
                    className="w-full h-96 p-3 border border-gray-300 rounded-lg shadow-inner bg-gray-50 font-mono text-sm"
                    aria-label="Processed document content"
                />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Download className="h-5 w-5" />
                    Download .docx
                </button>
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    <RefreshCw className="h-5 w-5" />
                    Process Another Paper
                </button>
            </div>
        </div>
    );
};
