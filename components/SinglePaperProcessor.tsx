import React, { useState, useCallback } from 'react';
import { processDocument } from '../services/geminiService';
import { Loader } from './Loader';
import { FileUpload } from './FileUpload';
import { ResultDisplay } from './ResultDisplay';
import { ArrowLeft, FileText } from './icons';

export const SinglePaperProcessor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
        setError('');
    };
    
    const handleProcessClick = useCallback(async () => {
        if (!file) {
            setError('Please select a file to process.');
            return;
        }
        if (!process.env.API_KEY) {
            setError('API Key is missing. Please ensure it is configured in your environment.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const { content } = await processDocument(file);
            setResult(content);
        } catch (err) {
            console.error('Error processing document:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during processing.';
            setError(`Processing failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    const handleReset = () => {
        setFile(null);
        setResult(null);
        setError('');
        setIsLoading(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return <Loader text="Processing Paper..." subtext="This may take a moment." />;
        }
        if (result && file) {
            return <ResultDisplay content={result} fileName={file.name} onReset={handleReset} />;
        }
        return (
            <div className="flex flex-col items-center gap-6">
                <FileUpload onFileSelect={handleFileSelect} selectedFile={file}/>
                {error && <p className="text-red-500 text-center font-medium -mt-2">{error}</p>}
                <button
                    onClick={handleProcessClick}
                    disabled={!file || isLoading}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Process Paper
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button onClick={onBack} className="absolute top-0 left-0 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to selection
            </button>
            <div className="text-center mb-8 pt-8">
                <div className="flex justify-center items-center gap-3 mb-2">
                    <FileText className="h-10 w-10 text-blue-600" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        UPSC Paper Processor
                    </h1>
                </div>
                <p className="text-md text-gray-600">
                    Translate Hindi content to Marathi while preserving English text and formatting.
                </p>
            </div>
             <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};
