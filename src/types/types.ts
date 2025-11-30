
export interface FinancialData {
  applicantIncome: number;
  respondentIncome: number;
  childSupport: number;
  spousalSupport: number;
  hasODSP: boolean;
  hasCPP: boolean;
  complianceNotes: string[];
}

export interface CaseInfo {
  parties: string;
  jurisdiction: string;
  caseNumber: string;
  date: string;
}

export interface CustodySchedule {
  id: number;
  label: string;
  value: string;
  detail: string;
}

export interface FinancialItem {
  id: number;
  type: 'support' | 'asset';
  title: string;
  amount: string;
  due: string;
}

export interface RiskItem {
  id: number;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface AnalysisData extends FinancialData {
  caseInfo: CaseInfo;
  custody: CustodySchedule[];
  financials: FinancialItem[];
  risks: RiskItem[];
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  timestamp: string;
  data: AnalysisData; // Updated to use the new rich structure
  redactedTextSnippet: string;
}

export type AppView = 'upload' | 'analyzing' | 'dashboard' | 'compliance' | 'profile';

export interface DocumentFile {
  file: File;
  preview?: string;
}

export type UserRole = 'self-represented' | 'lawyer' | 'legal-assistant' | 'student';

export interface UserPreferences {
  notifications: boolean;
  highContrast: boolean;
  autoRedaction: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  defaultJurisdictionId: string;
  preferences: UserPreferences;
  lastActive: string;
}