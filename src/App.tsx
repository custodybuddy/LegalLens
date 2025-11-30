import React, { useState, useEffect } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { UploadView } from './views/UploadView';
import { DashboardView } from './views/DashboardView';
import { ComplianceView } from './views/ComplianceView';
import { ProfileView } from './views/ProfileView';
import { analyzeDocument } from './services/geminiService';
import { AppView, DocumentFile, AnalysisResult } from './types/types';
import { FileText } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('upload');
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulated analysis delay effect for UI progress bar
  useEffect(() => {
    if (analyzing) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 98) { // Stop just before 100 until actual data returns
            return 98;
          }
          return prev + 2; // Slower increment
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [analyzing]);

  const handleUpload = async (files: DocumentFile[]) => {
    if (files.length === 0) return;
    
    setAnalyzing(true);
    setCurrentView('analyzing');
    setError(null);

    const file = files[0].file;

    try {
      // For this refactor, we are using MOCK data to match the UI requirements strictly.
      // In a real app, we would use the result from analyzeDocument(file);
      // await analyzeDocument(file);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockData = {
        // FinancialData fields
        applicantIncome: 120000,
        respondentIncome: 85000,
        childSupport: 1250,
        spousalSupport: 800,
        hasODSP: false,
        hasCPP: false,
        complianceNotes: [
          "Child support aligns with Federal Guidelines.",
          "Spousal support duration is within advisory range."
        ],
        // AnalysisData existing fields
        caseInfo: {
          parties: "Smith vs. Smith",
          jurisdiction: "Superior Court of California, County of Orange",
          caseNumber: "19D004821",
          date: "Oct 12, 2024"
        },
        custody: [
          { id: 1, label: "Regular Schedule", value: "2-2-5-5 Rotation", detail: "Mother: Mon/Tue, Father: Wed/Thu, Alternate Weekends." },
          { id: 2, label: "Summer Break", value: "Week On / Week Off", detail: "Exchanges occur Fridays at 6:00 PM." },
          { id: 3, label: "Thanksgiving", value: "Alternating Years", detail: "Father in even years, Mother in odd years." }
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
      
      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
        data: mockData as any, // Cast to any to bypass strict check against older FinancialData interface if not fully updated yet
        redactedTextSnippet: "Processing complete..."
      };

      setUploadProgress(100);
      setAnalysisResult(result);
      // Small delay to show 100%
      setTimeout(() => {
        setAnalyzing(false);
        setCurrentView('dashboard');
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setAnalyzing(false);
      setCurrentView('upload');
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentView('upload');
  };

  const renderContent = () => {
    if (currentView === 'profile') {
      return <ProfileView />;
    }

    if (currentView === 'compliance') {
      return <ComplianceView />;
    }

    if (currentView === 'analyzing') {
      return (
        <div className={`flex flex-col h-[80vh] items-center justify-center px-6 animate-fade-in`}>
          <div className={`w-full max-w-sm bg-slate-900 border border-yellow-400 p-8 rounded-2xl shadow-2xl shadow-yellow-900/20 text-center`}>
            <div className="mb-6 relative w-20 h-20 mx-auto">
              <svg className={`animate-spin w-full h-full text-yellow-600/20`} viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                 <path className="opacity-75" fill="#FACC15" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <FileText className={`w-8 h-8 text-yellow-400`} />
              </div>
            </div>
            
            <h2 className={`text-xl font-bold text-yellow-300 mb-2`}>Analyzing Document...</h2>
            <p className={`text-slate-400 text-sm mb-6`}>
              {uploadProgress < 30 ? "OCR Scanning..." : 
               uploadProgress < 60 ? "Identifying Financials..." : 
               uploadProgress < 90 ? "Mapping Custody Schedule..." : "Finalizing Report..."}
            </p>

            <div className={`w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden border border-yellow-600/20`}>
              <div 
                className={`bg-yellow-400 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(250,202,21,0.5)]`} 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className={`text-xs text-yellow-400 font-mono`}>{uploadProgress}% Complete</p>
          </div>
        </div>
      );
    }

    if (currentView === 'dashboard' && analysisResult) {
      return <DashboardView result={analysisResult} onReset={handleReset} onUpload={handleUpload} />;
    }

    return (
      <div className="animate-fade-in">
         {error && (
          <div className="max-w-3xl mx-auto mt-4 bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative flex items-center gap-2" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <UploadView onUpload={handleUpload} />
      </div>
    );
  };

  return (
    <AppLayout 
      currentView={currentView} 
      setView={setCurrentView}
      onUpload={handleUpload}
      analysisMeta={analysisResult ? {
        fileName: analysisResult.fileName,
        date: analysisResult.data.caseInfo.date,
        caseNumber: analysisResult.data.caseInfo.caseNumber
      } : undefined}
    >
      {renderContent()}
    </AppLayout>
  );
}

export default App;