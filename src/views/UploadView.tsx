
import React, { useCallback, useState } from 'react';
import { Upload, CheckCircle, Lock, Calendar, DollarSign, AlertTriangle, FileText } from 'lucide-react';
import { DocumentFile } from '../types/types';

interface UploadViewProps {
  onUpload: (files: DocumentFile[]) => void;
}

const ACCENT_COLOR_CLASS = 'text-yellow-400';
const NAVY_BG_CLASS = 'bg-slate-900';
const DARK_BG_CLASS = 'bg-gray-950';
const MUTED_TEXT_CLASS = 'text-slate-400';
const HIGHLIGHT_CLASS = 'text-yellow-200 font-semibold';

export const UploadView: React.FC<UploadViewProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUpload([{ file }]);
    }
  }, [onUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload([{ file }]);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <div className="flex-1 px-6 py-8 md:py-12 flex flex-col items-center text-center w-full max-w-[1120px] mx-auto justify-center">
        <div className={`bg-yellow-900/50 ${ACCENT_COLOR_CLASS} border border-yellow-600/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6`}>
          Beta • Family Law Focus
        </div>
        <h1 className={`text-4xl md:text-6xl font-extrabold text-yellow-300 mb-6 leading-tight max-w-4xl`}>
          Find the Loopholes. <br/>
          <span className="text-white">Kill the Arguments.</span> 
        </h1>
        <p className={`text-lg ${MUTED_TEXT_CLASS} mb-8 max-w-xl mx-auto leading-relaxed`}>
          Upload <span className={HIGHLIGHT_CLASS}>court orders, texts, and emails</span>. LegalLens instantly maps this <span className={HIGHLIGHT_CLASS}>messy data</span> onto your legal obligations.
        </p>

        {/* Upload Box */}
        <div 
          className={`w-full max-w-md ${NAVY_BG_CLASS} p-2 rounded-2xl shadow-xl border transform transition-all duration-300 ${
            dragActive 
              ? 'border-yellow-400 scale-105 shadow-[0_0_30px_rgba(250,204,21,0.3)] ring-2 ring-yellow-400/20' 
              : 'border-yellow-600/50 hover:scale-[1.01]'
          }`}
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
        >
          <div className={`border-2 border-dashed rounded-xl ${NAVY_BG_CLASS}/50 p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative ${
             dragActive 
               ? 'border-yellow-400 bg-yellow-900/10' 
               : 'border-yellow-600/40 hover:bg-slate-800 hover:border-yellow-400'
          }`}>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {dragActive ? (
              <>
                 <div className={`bg-yellow-400 p-4 rounded-full shadow-lg mb-4 animate-bounce`}>
                   <Upload className={`w-8 h-8 text-black`} />
                 </div>
                 <p className={`font-bold text-yellow-400 text-lg animate-pulse`}>Drop File to Analyze</p>
                 <p className={`text-xs text-yellow-200/70 mt-2`}>Release to start processing</p>
              </>
            ) : (
              <>
                <div className={`bg-yellow-900/30 p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform border border-yellow-600/40 group-hover:border-yellow-400/60`}>
                  <Upload className={`w-8 h-8 ${ACCENT_COLOR_CLASS}`} />
                </div>
                <p className={`font-semibold ${ACCENT_COLOR_CLASS}`}>Click or drop files here</p>
                <p className={`text-xs ${MUTED_TEXT_CLASS} mt-2`}>Court Orders (PDF), Text Screenshots, Emails</p>
              </>
            )}
          </div>
        </div>

        <div className={`mt-8 flex gap-4 text-xs ${MUTED_TEXT_CLASS} items-center justify-center`}>
          <div className={`flex items-center gap-1`}><Lock className={`w-3 h-3 ${ACCENT_COLOR_CLASS}`}/> Bank-Level Encryption</div>
          <div className={`flex items-center gap-1`}><CheckCircle className={`w-3 h-3 ${ACCENT_COLOR_CLASS}`}/> No Human Review</div>
        </div>
      </div>

      {/* Features Grid */}
      <section className={`${DARK_BG_CLASS} py-12 md:py-16 px-6 border-t border-yellow-600/20`}>
        <div className="max-w-[1120px] mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: "Custody Calendar", desc: "Visualize your 2-2-3 or week-on/off schedule clearly." },
            { icon: DollarSign, title: "Financial Deadlines", desc: "Never miss an alimony date or refinance deadline." },
            { icon: AlertTriangle, title: "Risk Detector", desc: "Identify vague clauses that cause future conflicts." }
          ].map((feature, i) => (
            <div key={i} className={`flex flex-col items-center text-center p-4 ${NAVY_BG_CLASS} border border-yellow-600/20 rounded-xl hover:border-yellow-400/50 transition-colors`}>
              <div className={`bg-yellow-900/30 p-3 rounded-lg mb-4 ${ACCENT_COLOR_CLASS} border border-yellow-600/30`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-yellow-300 mb-2`}>{feature.title}</h3>
              <p className={`text-sm ${MUTED_TEXT_CLASS} leading-relaxed`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
