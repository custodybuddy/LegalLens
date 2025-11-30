import React, { useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { UploadView } from './views/UploadView';
import { DashboardView } from './views/DashboardView';
import { ComplianceView } from './views/ComplianceView';
import { ProfileView } from './views/ProfileView';
import { AppView, DocumentFile } from './types/types';
import { useAnalysisFlow } from './lib/useAnalysisFlow';
import { AnalyzingView } from './components/AnalyzingView';
import { ErrorAlert } from './components/ErrorAlert';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('upload');
  const {
    analysisResult,
    error,
    uploadProgress,
    handleUpload,
    reset,
  } = useAnalysisFlow({
    onStatusChange: (status) => {
      if (status === 'analyzing') {
        setCurrentView('analyzing');
      } else if (status === 'complete') {
        setCurrentView('dashboard');
      } else if (status === 'error' || status === 'idle') {
        setCurrentView('upload');
      }
    },
  });

  const handleReset = () => {
    reset();
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
      return <AnalyzingView uploadProgress={uploadProgress} />;
    }

    if (currentView === 'dashboard' && analysisResult) {
      return <DashboardView result={analysisResult} onReset={handleReset} onUpload={handleUpload} />;
    }

    return (
      <div className="animate-fade-in">
        {error && <ErrorAlert error={error} />}
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