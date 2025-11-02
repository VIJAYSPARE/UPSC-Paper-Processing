import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, FileImage, FileCode, X } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-6 w-6 text-purple-500" />;
    if (fileType === 'application/pdf') return <FileText className="h-6 w-6 text-red-500" />;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <FileCode className="h-6 w-6 text-blue-500" />;
    return <FileText className="h-6 w-6 text-gray-500" />;
};

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
    // Reset the input value to allow re-uploading the same file
    if (event.target) {
        event.target.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDragEvents = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if(event.type === 'dragenter' || event.type === 'dragover') {
        setIsDragging(true);
    } else if (event.type === 'dragleave') {
        setIsDragging(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
      onFileSelect(null);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={`w-full max-w-2xl border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
        onClick={handleButtonClick}
        onDrop={handleDrop}
        onDragEnter={handleDragEvents}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
        <div className="flex flex-col items-center text-gray-600">
          <UploadCloud className="h-12 w-12 mb-4 text-gray-400" />
          <p className="font-semibold">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">PDF, DOCX, JPG, PNG file</p>
        </div>
      </div>
      {selectedFile && (
        <div className="mt-6 w-full max-w-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Selected Paper:</h3>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md border">
                <div className="flex items-center gap-3">
                    {getFileIcon(selectedFile.type)}
                    <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                </div>
                <button onClick={handleRemoveFile} className="text-gray-500 hover:text-red-600">
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
