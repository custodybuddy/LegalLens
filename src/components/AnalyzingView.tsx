import React from 'react';
import { FileText } from 'lucide-react';

interface AnalyzingViewProps {
  uploadProgress: number;
}

export const AnalyzingView: React.FC<AnalyzingViewProps> = ({ uploadProgress }) => {
  const getStatusText = () => {
    if (uploadProgress < 30) return 'OCR Scanning...';
    if (uploadProgress < 60) return 'Identifying Financials...';
    if (uploadProgress < 90) return 'Mapping Custody Schedule...';
    return 'Finalizing Report...';
  };

  return (
    <div className="flex flex-col h-[80vh] items-center justify-center px-6 animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-yellow-400 p-8 rounded-2xl shadow-2xl shadow-yellow-900/20 text-center">
        <div className="mb-6 relative w-20 h-20 mx-auto">
          <svg className="animate-spin w-full h-full text-yellow-600/20" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="#FACC15" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-yellow-300 mb-2">Analyzing Document...</h2>
        <p className="text-slate-400 text-sm mb-6">{getStatusText()}</p>

        <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden border border-yellow-600/20">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(250,202,21,0.5)]"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-xs text-yellow-400 font-mono">{uploadProgress}% Complete</p>
      </div>
    </div>
  );
};
