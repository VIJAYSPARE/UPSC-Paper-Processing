
import React, { useRef } from 'react';
import { UploadCloud } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-gray-50"
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />
        <div className="flex flex-col items-center text-gray-600">
          <UploadCloud className="h-12 w-12 mb-4 text-gray-400" />
          <p className="font-semibold">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">PDF, PNG, JPG, or other document formats</p>
        </div>
      </div>
      {fileName && (
        <p className="mt-4 text-sm text-gray-700 font-medium">
          Selected file: <span className="text-blue-600">{fileName}</span>
        </p>
      )}
    </div>
  );
};
