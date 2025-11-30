
import React from 'react';
import { AnalysisResult } from '../types/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, AlertTriangle, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardViewProps {
  result: AnalysisResult | null;
  onReset: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ result, onReset }) => {
  if (!result) return null;

  const chartData = [
    { name: 'Applicant', Income: result.data.applicantIncome, fill: '#60A5FA' },
    { name: 'Respondent', Income: result.data.respondentIncome, fill: '#D4A83B' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-[fade-in_0.5s_ease-out] pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-6 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-prata heading-gold mb-1">Analysis Report</h2>
          <p className="text-xs md:text-sm text-cb-muted font-raleway truncate max-w-[300px] md:max-w-none">
            {result.fileName} • {result.timestamp}
          </p>
        </div>
        <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={onReset} className="w-full md:w-auto">
            New Analysis
          </Button>
          <Button className="w-full md:w-auto gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* ODSP/Compliance Alerts */}
      {(result.data.hasODSP || result.data.hasCPP) && (
        <div className="bg-yellow-900/10 border border-yellow-500/30 p-4 md:p-5 rounded-xl mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500/10 p-2 rounded-lg">
              <AlertTriangle className="text-cb-primary w-6 h-6 flex-shrink-0" />
            </div>
            <div>
              <h4 className="font-prata font-bold text-cb-primary text-base md:text-lg">Benefit Adjustment Detected</h4>
              <p className="text-xs md:text-sm text-gray-300 mt-1 font-raleway leading-relaxed">
                Refers to ODSP or CPP-D. Check for special income inclusions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Support Summary Cards */}
        <Card className="border-l-2 border-l-blue-500/50">
          <CardContent className="mt-0 pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-cb-muted font-raleway font-medium uppercase tracking-wider">Child Support (Mo.)</p>
                <h3 className="text-2xl md:text-3xl font-prata text-white mt-2">{formatCurrency(result.data.childSupport)}</h3>
              </div>
              <div className="bg-blue-900/20 p-2.5 rounded-lg text-blue-400 border border-blue-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-2 border-l-cb-primary/50">
           <CardContent className="mt-0 pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-cb-muted font-raleway font-medium uppercase tracking-wider">Spousal Support (Mo.)</p>
                <h3 className="text-2xl md:text-3xl font-prata heading-gold mt-2">{formatCurrency(result.data.spousalSupport)}</h3>
              </div>
              <div className="bg-yellow-900/20 p-2.5 rounded-lg text-cb-primary border border-cb-primary/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-2 border-l-green-500/50">
           <CardContent className="mt-0 pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-cb-muted font-raleway font-medium uppercase tracking-wider">Compliance Flags</p>
                <h3 className="text-2xl md:text-3xl font-prata text-green-400 mt-2">{result.data.complianceNotes.length} Found</h3>
              </div>
              <div className="bg-green-900/20 p-2.5 rounded-lg text-green-400 border border-green-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Income Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12, fontFamily: 'Raleway'}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => `${val/1000}k`} 
                    tick={{fill: '#9CA3AF', fontSize: 12, fontFamily: 'Raleway'}} 
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,215,0,0.05)'}}
                    formatter={(value: number) => [formatCurrency(value), 'Income']}
                    contentStyle={{ backgroundColor: '#010A1A', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Raleway' }}
                  />
                  <Bar dataKey="Income" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 md:max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {result.data.complianceNotes.length > 0 ? (
                result.data.complianceNotes.map((note, idx) => (
                  <div key={idx} className="flex gap-4 text-xs md:text-sm p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-cb-navy text-cb-primary border border-cb-primary/30 flex items-center justify-center text-[10px] md:text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <p className="text-gray-300 leading-relaxed font-raleway pt-0.5">{note}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic font-raleway p-4">No specific compliance issues found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redaction Preview */}
      <Card className="opacity-80">
        <CardHeader>
          <CardTitle className="text-lg">Privacy Log</CardTitle>
          <CardDescription>Real-time redaction audit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-[#050505] text-green-400 p-4 rounded-lg font-mono text-[10px] md:text-xs overflow-x-auto border border-white/10 shadow-inner">
            <p className="mb-2 text-gray-500 border-b border-gray-800 pb-2"># PII Auto-Redaction Log (Ephemeral Mode)</p>
            <div className="space-y-1 opacity-90">
              <p>[INFO] Scanning for names, addresses...</p>
              <p>[REDACT] Found Applicant Name: "********"</p>
              <p>[REDACT] Found Address: "********, ON"</p>
              <p className="text-cb-primary">[SUCCESS] Ephemeral session cleared.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
