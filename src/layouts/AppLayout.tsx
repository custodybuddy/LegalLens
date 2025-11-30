import React, { useRef } from 'react';
import { Shield, User, Home, ShieldCheck, FileText, X, Upload } from 'lucide-react';
import { AppView, DocumentFile } from '../types/types';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  analysisMeta?: {
    fileName: string;
    date: string;
    caseNumber: string;
  };
  onUpload?: (files: DocumentFile[]) => void;
}

const ACCENT_COLOR_CLASS = 'text-yellow-400';
const NAVY_BG_CLASS = 'bg-slate-900';
const MUTED_TEXT_CLASS = 'text-slate-400';
const ACCENT_BG_CLASS = 'bg-yellow-400';
const ACCENT_HOVER_BG_CLASS = 'hover:bg-yellow-500';

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  currentView, 
  setView,
  analysisMeta,
  onUpload
}) => {
  const isDashboardOrAnalyzing = currentView === 'analyzing' || currentView === 'dashboard';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload([{ file: e.target.files[0] }]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: React.ElementType; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
          isActive ? ACCENT_COLOR_CLASS : MUTED_TEXT_CLASS
        }`}
      >
        <Icon className={`w-6 h-6 ${isActive ? 'fill-current/10' : ''}`} />
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-950 font-sans text-slate-200 ${!isDashboardOrAnalyzing ? 'pb-16 md:pb-0' : ''}`}>
      
      {/* Desktop Navigation */}
      {!isDashboardOrAnalyzing && (
        <nav className={`${NAVY_BG_CLASS} border-b border-yellow-600/30 px-6 py-4 hidden md:flex justify-center sticky top-0 z-50 shadow-lg shadow-black/50`}>
          <div className="flex justify-between items-center w-full max-w-[1120px]">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('upload')}>
              <Shield className={`w-6 h-6 ${ACCENT_COLOR_CLASS}`} />
              <span className={`font-bold text-xl tracking-tight ${ACCENT_COLOR_CLASS}`}>LegalLens</span>
            </div>
            
            <div className="flex items-center gap-8">
              <div className={`flex gap-6 text-sm font-medium ${MUTED_TEXT_CLASS}`}>
                <button onClick={() => setView('upload')} className={`hover:${ACCENT_COLOR_CLASS} transition-colors ${currentView === 'upload' ? ACCENT_COLOR_CLASS : ''}`}>Home</button>
                <button onClick={() => setView('profile')} className={`hover:${ACCENT_COLOR_CLASS} transition-colors ${currentView === 'profile' ? ACCENT_COLOR_CLASS : ''}`}>Profile</button>
                <button onClick={() => setView('compliance')} className={`hover:${ACCENT_COLOR_CLASS} transition-colors ${currentView === 'compliance' ? ACCENT_COLOR_CLASS : ''}`}>Compliance</button>
              </div>
              <div className={`flex items-center gap-4 border-l border-yellow-600/30 pl-8`}>
                <button className={`text-sm font-bold ${ACCENT_COLOR_CLASS} hover:text-white transition-colors`}>Log In</button>
                <button 
                  onClick={() => setView('upload')}
                  className={`${ACCENT_BG_CLASS} ${ACCENT_HOVER_BG_CLASS} text-black text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-md shadow-yellow-800/20`}
                >
                  Analyze
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Top Header */}
      {(!isDashboardOrAnalyzing || (currentView === 'dashboard' && analysisMeta)) && (
        <header className={`${NAVY_BG_CLASS} border-b border-yellow-600/30 px-4 py-3 md:hidden sticky top-0 z-50 flex justify-between items-center shadow-md shadow-black/20`}>
           {currentView === 'dashboard' && analysisMeta ? (
             <>
               <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`bg-yellow-900/30 p-1.5 rounded-lg ${ACCENT_COLOR_CLASS} border border-yellow-600/20 flex-shrink-0`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className={`font-bold text-yellow-300 text-sm leading-tight truncate`}>{analysisMeta.fileName}</h2>
                    <p className={`text-[10px] ${MUTED_TEXT_CLASS} truncate`}>{analysisMeta.date} • {analysisMeta.caseNumber}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 flex-shrink-0">
                  {onUpload && (
                    <>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`${NAVY_BG_CLASS} border border-yellow-600/50 text-yellow-400 p-1.5 rounded-lg`}
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button onClick={() => setView('upload')} className={`${ACCENT_COLOR_CLASS} p-1`}>
                    <X className="w-5 h-5" />
                  </button>
               </div>
             </>
           ) : (
             <>
               <div className="flex items-center gap-2" onClick={() => setView('upload')}>
                <Shield className={`w-5 h-5 ${ACCENT_COLOR_CLASS}`} />
                <span className={`font-bold text-lg tracking-tight ${ACCENT_COLOR_CLASS}`}>LegalLens</span>
              </div>
               <button 
                  onClick={() => setView('upload')}
                  className={`${ACCENT_BG_CLASS} active:scale-95 text-black text-xs font-bold px-3 py-1.5 rounded-md transition-transform`}
                >
                  Analyze
                </button>
             </>
           )}
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full flex flex-col ${isDashboardOrAnalyzing ? 'h-screen overflow-hidden' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {!isDashboardOrAnalyzing && (
        <div className={`fixed bottom-0 left-0 right-0 h-16 ${NAVY_BG_CLASS} border-t border-yellow-600/30 flex justify-around items-center md:hidden z-50 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.3)] backdrop-blur-lg bg-slate-900/95`}>
          <NavItem view="upload" icon={Home} label="Home" />
          <NavItem view="compliance" icon={ShieldCheck} label="Compliance" />
          <NavItem view="profile" icon={User} label="Profile" />
        </div>
      )}
    </div>
  );
};