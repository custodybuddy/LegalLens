
import React, { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DocumentFile } from '../types/types';
import { cn } from '../lib/utils';

interface UploadViewProps {
  onUpload: (files: DocumentFile[]) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file type. Please upload PDF, JPG, or PNG.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Max 10MB.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleProcess = () => {
    if (selectedFile) {
      onUpload([{ file: selectedFile }]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-4 md:pt-10 animate-[fade-in-up_0.5s_ease-out]">
      <div className="text-center mb-6 md:mb-12 px-2">
        <h2 className="text-3xl md:text-4xl font-prata font-medium heading-gold mb-3">Upload Document</h2>
        <p className="text-sm md:text-base text-cb-muted font-raleway max-w-lg mx-auto">
          Upload Financial Statements (Form 13.1) or Court Orders for instant, secure analysis.
        </p>
      </div>

      <div 
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-500 p-6 md:p-12 flex flex-col items-center justify-center min-h-[250px] md:min-h-[350px]",
          dragActive 
            ? 'border-cb-primary bg-cb-primary/10 shadow-cb-glow' 
            : 'border-white/10 bg-cb-card hover:border-cb-primary/40 hover:bg-white/5',
          error ? 'border-red-500/50 bg-red-900/10' : ''
        )}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        {!selectedFile ? (
          <>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-cb-navy rounded-full flex items-center justify-center mb-6 border border-cb-primary/20 transition-transform duration-300 group-hover:scale-110">
              <Upload className="w-8 h-8 md:w-10 md:h-10 text-cb-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-prata font-medium text-white mb-2 text-center">Tap to Upload or Drag & Drop</h3>
            <p className="text-xs md:text-sm text-cb-muted font-raleway mb-8">PDF, PNG, JPG (Max 10MB)</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-white/5 border border-white/10 text-gray-400 text-[10px] md:text-xs px-3 py-1.5 rounded-full font-raleway">Form 13.1</span>
              <span className="bg-white/5 border border-white/10 text-gray-400 text-[10px] md:text-xs px-3 py-1.5 rounded-full font-raleway">Separation Agreement</span>
            </div>
          </>
        ) : (
          <div className="w-full relative z-20 bg-cb-navy p-5 rounded-xl shadow-lg border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 flex-shrink-0 bg-cb-primary/10 rounded-lg flex items-center justify-center text-cb-primary border border-cb-primary/20">
                <File className="w-6 h-6" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-white text-sm md:text-base font-raleway truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); setSelectedFile(null); }}
              className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-300 text-sm font-raleway">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && (
        <div className="mt-8 md:mt-10 flex justify-center">
          <Button onClick={handleProcess} className="w-full md:w-auto min-w-[200px] text-lg py-6">
            Analyze Document
          </Button>
        </div>
      )}
    </div>
  );
};
