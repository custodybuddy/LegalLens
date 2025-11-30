import React from 'react';

interface ErrorAlertProps {
  error: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => (
  <div className="max-w-3xl mx-auto mt-4 bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative flex items-center gap-2" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline">{error}</span>
  </div>
);
