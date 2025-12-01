
import React, { useState, useRef, useCallback } from 'react';
import { AnalysisResult, DocumentFile } from '../types/types';
import { Download, X, FileText, CheckCircle, Search, ChevronRight, Calendar, DollarSign, AlertTriangle, Upload, User } from 'lucide-react';

interface DashboardViewProps {
  result: AnalysisResult | null;
  onReset: () => void;
  onUpload: (files: DocumentFile[]) => void;
}

// Theme Constants
const ACCENT_COLOR_CLASS = 'text-yellow-400';
const ACCENT_BG_CLASS = 'bg-yellow-400';
const ACCENT_HOVER_BG_CLASS = 'hover:bg-yellow-500';
const NAVY_BG_CLASS = 'bg-slate-900';
const LIGHT_TEXT_CLASS = 'text-slate-200';
const MUTED_TEXT_CLASS = 'text-slate-400';
const DARK_BG_CLASS = 'bg-gray-950';

export const DashboardView: React.FC<DashboardViewProps> = ({ result, onReset, onUpload }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [chatQuery, setChatQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      // Check if we are leaving the window/container
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       // Simple validation
       if (file.type.match(/pdf|image/)) {
         onUpload([{ file }]);
       }
    }
  }, [onUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload([{ file: e.target.files[0] }]);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Fallback data if result doesn't have the new rich structure (for compatibility with previous mock/service)
  // In a real scenario, we would assert result.data matches AnalysisData
  const data = result?.data || {
    caseInfo: {
      parties: "Smith vs. Smith",
      jurisdiction: "Superior Court of California, County of Orange",
      caseNumber: "19D004821",
      date: "Oct 12, 2024"
    },
    custody: [
      { id: 1, label: "Regular Schedule", value: "2-2-5-5 Rotation", detail: "Mother: Mon/Tue, Father: Wed/Thu, Alternate Weekends.", responsibility: "Shared" },
      { id: 2, label: "Summer Break", value: "Week On / Week Off", detail: "Exchanges occur Fridays at 6:00 PM.", responsibility: "Alternating" },
      { id: 3, label: "Thanksgiving", value: "Alternating Years", detail: "Father in even years, Mother in odd years.", responsibility: "Alternating" }
    ],
    financials: [
      { id: 1, type: "support", title: "Child Support", amount: "$1,250/mo", due: "1st of month" },
      { id: 2, type: "support", title: "Spousal Support", amount: "$800/mo", due: "Until Dec 2028" },
      { id: 3, type: "asset", title: "Marital Home Refinance", amount: "Deadline", due: "Must complete by June 1, 2026" }
    ],
    risks: [
      { id: 1, severity: "high", title: "Missing Tax Exemption", description: "The decree does not specify who claims the children as dependents for IRS/CRA purposes in alternating years." },
      { id: 2, severity: "medium", title: "Vague Exchange Location", description: "Paragraph 4.2 states 'mutually agreed public place'. This often leads to conflict. Recommendation: Specify a police station or school." },
      { id: 3, severity: "low", title: "Passport Provisions", description: "No clause regarding possession of children's passports or travel notification requirements." }
    ]
  };

  const caseInfo = (data as any).caseInfo || data; // Handle potential structure mismatch gracefully

  return (
    <div 
      className={`flex flex-col h-screen ${DARK_BG_CLASS} font-sans ${LIGHT_TEXT_CLASS} overflow-hidden relative`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onDragLeave={handleDrag}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200 pointer-events-none">
          <div className="bg-slate-900 border-4 border-dashed border-yellow-400 rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl shadow-yellow-900/50 transform scale-110 transition-transform">
             <div className="bg-yellow-400 p-6 rounded-full shadow-lg mb-6 animate-bounce">
                <Upload className="w-12 h-12 text-black" />
             </div>
             <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Drop to Analyze</h3>
             <p className="text-yellow-200/80 font-medium">Orders, texts, or emails</p>
          </div>
        </div>
      )}

      {/* Dashboard Header - Hidden on mobile as AppLayout handles it */}
      <header className={`${NAVY_BG_CLASS} border-b border-yellow-600/30 sticky top-0 z-30 shadow-lg shadow-black/50 hidden md:block`}>
        <div className="flex justify-between items-center max-w-[1120px] mx-auto px-4 py-3 w-full">
          <div className="flex items-center gap-3">
            <div className={`bg-yellow-900/30 p-2 rounded-lg ${ACCENT_COLOR_CLASS} border border-yellow-600/20`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-bold text-yellow-300 text-sm leading-tight`}>{result?.fileName || 'Decree_Final.pdf'}</h2>
              <p className={`text-xs ${MUTED_TEXT_CLASS}`}>{(data as any).caseInfo?.date || 'Today'} • {(data as any).caseInfo?.caseNumber || 'Unknown'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 ${NAVY_BG_CLASS} border border-yellow-600/50 text-yellow-400 hover:bg-yellow-900/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors`}
              title="Upload New Document"
            >
              <Upload className="w-4 h-4" /> 
              <span className="hidden md:inline">Analyze New</span>
              <span className="md:hidden">New</span>
            </button>
            <button className={`hidden md:flex items-center gap-2 ${ACCENT_BG_CLASS} ${ACCENT_HOVER_BG_CLASS} text-black px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-md`}>
              <Download className="w-4 h-4" /> Export
            </button>
            <button className={`${ACCENT_COLOR_CLASS} hover:${LIGHT_TEXT_CLASS} p-1`} onClick={onReset}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className={`${NAVY_BG_CLASS} border-b border-yellow-600/30 sticky top-16 z-20`}>
        <div className="flex overflow-x-auto no-scrollbar max-w-[1120px] mx-auto w-full">
          {['summary', 'custody', 'financials', 'risks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold capitalize border-b-2 transition-colors whitespace-nowrap px-4 ${
                activeTab === tab 
                  ? 'border-yellow-400 text-yellow-300 bg-yellow-900/10' 
                  : `border-transparent ${MUTED_TEXT_CLASS} hover:${ACCENT_COLOR_CLASS} hover:bg-slate-800`
              }`}
            >
              {tab}
              {tab === 'risks' && (data as any).risks?.length > 0 && (
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-yellow-400 text-black' : 'bg-red-900/50 text-red-400 border border-red-500/50'}`}>
                  {(data as any).risks.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4 max-w-[1120px] mx-auto w-full custom-scrollbar">
        
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className={`${NAVY_BG_CLASS} p-5 rounded-xl border border-yellow-600 shadow-xl shadow-black/20`}>
              <h3 className={`text-xs font-bold ${ACCENT_COLOR_CLASS} uppercase tracking-wider mb-4 border-b border-yellow-600/20 pb-2`}>Case Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-yellow-600/10 pb-2">
                  <span className={`${ACCENT_COLOR_CLASS} text-sm`}>Parties</span>
                  <span className={`font-medium ${LIGHT_TEXT_CLASS} text-sm`}>{(data as any).caseInfo?.parties || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-yellow-600/10 pb-2">
                  <span className={`${ACCENT_COLOR_CLASS} text-sm`}>Court</span>
                  <span className={`font-medium ${LIGHT_TEXT_CLASS} text-sm text-right max-w-[60%]`}>{(data as any).caseInfo?.jurisdiction || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${ACCENT_COLOR_CLASS} text-sm`}>Status</span>
                  <span className="font-medium text-green-400 text-sm flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Finalized</span>
                </div>
              </div>
            </div>

            <div className={`bg-slate-900/50 p-4 rounded-xl border border-yellow-400 flex gap-3 items-start`}>
              <div className={`bg-yellow-900/30 p-2 rounded-full shadow-sm ${ACCENT_COLOR_CLASS} shrink-0 border border-yellow-600/30`}>
                <Search className="w-4 h-4" />
              </div>
              <div className="w-full">
                <h4 className={`font-bold text-yellow-300 text-sm`}>Ask LegalLens</h4>
                <p className={`text-xs ${MUTED_TEXT_CLASS} mt-1 mb-2`}>Ask questions like "Who pays for braces?" or "Can I move out of state?"</p>
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    placeholder="Type a question about this document..."
                    className={`w-full ${NAVY_BG_CLASS} border border-yellow-600 rounded-lg py-2 px-3 text-sm ${LIGHT_TEXT_CLASS} focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-slate-500`}
                  />
                  {chatQuery && (
                     <button className={`absolute right-2 top-1.5 ${ACCENT_BG_CLASS} text-black p-1 rounded ${ACCENT_HOVER_BG_CLASS} transition-colors`}>
                       <ChevronRight className="w-3 h-3" />
                     </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custody Tab */}
        {activeTab === 'custody' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {(data as any).custody?.map((item: any) => (
              <div key={item.id} className={`${NAVY_BG_CLASS} p-4 rounded-xl border border-yellow-600 shadow-sm flex flex-col gap-2`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${ACCENT_COLOR_CLASS}`} />
                    <span className={`font-bold text-yellow-300`}>{item.label}</span>
                  </div>
                  <span className={`bg-yellow-900/30 ${ACCENT_COLOR_CLASS} border border-yellow-600/30 text-xs px-2 py-1 rounded-md font-medium`}>{item.value}</span>
                </div>
                
                {item.responsibility && (
                  <div className="flex items-center gap-2 text-xs mt-1 ml-6">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Responsibility:</span>
                    <span className="text-white font-medium">{item.responsibility}</span>
                  </div>
                )}
                
                <p className={`text-sm ${LIGHT_TEXT_CLASS} ml-6 mt-1`}>{item.detail}</p>
              </div>
            ))}
            {!(data as any).custody && <p className="text-center text-gray-500">No custody data found.</p>}
          </div>
        )}

        {/* Financials Tab */}
        {activeTab === 'financials' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {(data as any).financials?.map((item: any) => (
              <div key={item.id} className={`${NAVY_BG_CLASS} p-4 rounded-xl border border-yellow-600 shadow-sm flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${item.type === 'support' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-orange-900/20 text-orange-400 border-orange-500/30'}`}>
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-yellow-300 text-sm`}>{item.title}</h4>
                    <p className={`text-xs ${MUTED_TEXT_CLASS}`}>{item.due}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`block font-bold ${item.type === 'asset' ? 'text-orange-400' : `${LIGHT_TEXT_CLASS}`}`}>{item.amount}</span>
                  {item.type === 'asset' && <span className={`text-[10px] ${MUTED_TEXT_CLASS} uppercase tracking-wide`}>Action Req</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className={`bg-yellow-900/30 border border-yellow-600 p-3 rounded-lg text-xs ${ACCENT_COLOR_CLASS} mb-2 flex gap-2`}>
               <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
               <span>These items are flagged as vague or missing. Consult an attorney to clarify these before problems arise.</span>
             </div>
            {(data as any).risks?.map((item: any) => (
              <div key={item.id} className={`${NAVY_BG_CLASS} p-4 rounded-xl border border-yellow-600 border-l-4 shadow-sm relative overflow-hidden`}
                   style={{ borderLeftColor: item.severity === 'high' ? '#f87171' : item.severity === 'medium' ? '#fbbf24' : '#60a5fa' }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-yellow-300 text-sm flex items-center gap-2`}>
                    <AlertTriangle className={`w-4 h-4 ${item.severity === 'high' ? 'text-red-400' : item.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'}`} />
                    {item.title}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    item.severity === 'high' ? 'bg-red-900/30 text-red-400 border-red-500/50' : 
                    item.severity === 'medium' ? 'bg-amber-900/30 text-amber-400 border-amber-500/50' : 
                    'bg-blue-900/30 text-blue-400 border-blue-500/50'
                  }`}>
                    {item.severity} Risk
                  </span>
                </div>
                <p className={`text-sm ${LIGHT_TEXT_CLASS} leading-relaxed`}>
                  {item.description}
                </p>
                <button className={`mt-3 text-xs font-medium ${ACCENT_COLOR_CLASS} flex items-center hover:underline group`}>
                  View in Document <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
