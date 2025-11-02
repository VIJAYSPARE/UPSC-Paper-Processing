import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, FileImage, FileCode, X } from './icons';

interface MultiFileUploadProps {
  onFilesSelect: (files: File[]) => void;
}

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-6 w-6 text-purple-500" />;
    if (fileType === 'application/pdf') return <FileText className="h-6 w-6 text-red-500" />;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <FileCode className="h-6 w-6 text-blue-500" />;
    return <FileText className="h-6 w-6 text-gray-500" />;
};


export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({ onFilesSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const allFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(allFiles);
      onFilesSelect(allFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelect(newFiles);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if(files && files.length > 0) {
        const newFiles = Array.from(files);
        const allFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(allFiles);
        onFilesSelect(allFiles);
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-gray-50"
        onClick={handleButtonClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
        />
        <div className="flex flex-col items-center text-gray-600">
          <UploadCloud className="h-12 w-12 mb-4 text-gray-400" />
          <p className="font-semibold">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">PDF, DOCX, JPG, PNG files</p>
        </div>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Selected Papers:</h3>
            <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md border">
                        <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        </div>
                        <button onClick={() => handleRemoveFile(index)} className="text-gray-500 hover:text-red-600">
                            <X className="h-5 w-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};