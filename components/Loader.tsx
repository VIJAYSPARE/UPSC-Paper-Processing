import React from 'react';
import { LoaderCircle } from './icons';

interface LoaderProps {
  text?: string;
  subtext?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text, subtext }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 text-gray-600">
      <LoaderCircle className="h-12 w-12 animate-spin text-blue-600" />
      <p className="text-lg font-semibold">{text || 'Loading...'}</p>
      {subtext && <p className="text-sm text-center">{subtext}</p>}
    </div>
  );
};