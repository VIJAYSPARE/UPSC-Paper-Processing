
import React from 'react';
import { LoaderCircle } from './icons';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 text-gray-600">
      <LoaderCircle className="h-12 w-12 animate-spin text-blue-600" />
      <p className="text-lg font-semibold">Processing Document...</p>
      <p className="text-sm text-center">Translating Hindi to Marathi and preserving format. This may take a moment.</p>
    </div>
  );
};
