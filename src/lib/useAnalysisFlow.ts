import { useCallback, useEffect, useState } from 'react';
import { AnalysisResult, DocumentFile } from '../types/types';

type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';

interface UseAnalysisFlowOptions {
  onStatusChange?: (status: AnalysisStatus) => void;
}

const incrementProgress = (prev: number) => {
  if (prev >= 98) return 98;
  return prev + 2;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAnalysisFlow = (options?: UseAnalysisFlowOptions) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analyzing) return;

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => incrementProgress(prev));
    }, 50);

    return () => clearInterval(interval);
  }, [analyzing]);

  const runMockAnalysis = useCallback(async (file: File) => {
    options?.onStatusChange?.('analyzing');

    // Simulated API delay
    await delay(3000);

    const mockData = {
      applicantIncome: 120000,
      respondentIncome: 85000,
      childSupport: 1250,
      spousalSupport: 800,
      hasODSP: false,
      hasCPP: false,
      complianceNotes: [
        'Child support aligns with Federal Guidelines.',
        'Spousal support duration is within advisory range.'
      ],
      caseInfo: {
        parties: 'Smith vs. Smith',
        jurisdiction: 'Superior Court of California, County of Orange',
        caseNumber: '19D004821',
        date: 'Oct 12, 2024'
      },
      custody: [
        { id: 1, label: 'Regular Schedule', value: '2-2-5-5 Rotation', detail: 'Mother: Mon/Tue, Father: Wed/Thu, Alternate Weekends.' },
        { id: 2, label: 'Summer Break', value: 'Week On / Week Off', detail: 'Exchanges occur Fridays at 6:00 PM.' },
        { id: 3, label: 'Thanksgiving', value: 'Alternating Years', detail: 'Father in even years, Mother in odd years.' }
      ],
      financials: [
        { id: 1, type: 'support', title: 'Child Support', amount: '$1,250/mo', due: '1st of month' },
        { id: 2, type: 'support', title: 'Spousal Support', amount: '$800/mo', due: 'Until Dec 2028' },
        { id: 3, type: 'asset', title: 'Marital Home Refinance', amount: 'Deadline', due: 'Must complete by June 1, 2026' }
      ],
      risks: [
        { id: 1, severity: 'high', title: 'Missing Tax Exemption', description: 'The decree does not specify who claims the children as dependents for IRS/CRA purposes in alternating years.' },
        { id: 2, severity: 'medium', title: 'Vague Exchange Location', description: "Paragraph 4.2 states 'mutually agreed public place'. This often leads to conflict. Recommendation: Specify a police station or school." },
        { id: 3, severity: 'low', title: 'Passport Provisions', description: "No clause regarding possession of children's passports or travel notification requirements." }
      ]
    };

    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      fileName: file.name,
      timestamp: new Date().toLocaleString(),
      data: mockData as any,
      redactedTextSnippet: 'Processing complete...'
    };

    setUploadProgress(100);
    setAnalysisResult(result);
    await delay(500);

    return result;
  }, [options]);

  const handleUpload = useCallback(async (files: DocumentFile[]) => {
    if (files.length === 0) return null;

    setAnalyzing(true);
    setError(null);

    try {
      const result = await runMockAnalysis(files[0].file);
      options?.onStatusChange?.('complete');
      return result;
    } catch (err: any) {
      console.error(err);
      const message = err?.message || 'An unexpected error occurred during analysis.';
      setAnalysisResult(null);
      setError(message);
      options?.onStatusChange?.('error');
      throw err;
    } finally {
      setAnalyzing(false);
    }
  }, [runMockAnalysis, options]);

  const reset = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setUploadProgress(0);
    setAnalyzing(false);
    options?.onStatusChange?.('idle');
  }, [options]);

  return {
    analyzing,
    analysisResult,
    error,
    uploadProgress,
    handleUpload,
    reset,
  };
};

export type UseAnalysisFlowReturn = ReturnType<typeof useAnalysisFlow>;
