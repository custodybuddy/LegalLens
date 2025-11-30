import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ShieldCheck, Database, Trash2, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ComplianceView: React.FC = () => {
  return (
    <div className="max-w-[1120px] mx-auto space-y-6 md:space-y-8 animate-[fade-in_0.5s_ease-out] pb-12 px-4 md:px-0">
      <div className="mb-6 md:mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs uppercase tracking-[0.2em] text-cb-muted font-semibold">
          Security & Trust
        </div>
        <h2 className="text-2xl md:text-3xl font-prata text-white mt-4 mb-2 leading-tight">Compliance Center</h2>
        <p className="text-sm text-cb-muted font-raleway max-w-2xl">Manage retention policies, view logs, and verify PIPEDA status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-emerald-900/30 shadow-2xl shadow-emerald-900/30">
          <CardHeader className="border-white/5">
            <CardTitle>Data Retention</CardTitle>
            <p className="text-xs text-cb-muted font-raleway">Realtime view of how your data is treated inside the session.</p>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-300 border border-emerald-400/40 shadow-inner shadow-emerald-900/40">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-prata font-semibold text-white text-lg md:text-xl">Strictly Ephemeral</h3>
                <p className="text-sm text-gray-400 font-raleway max-w-xs mx-auto leading-relaxed">
                  Documents processed in memory only. No PII is persisted on servers.
                </p>
              </div>
              <div className="w-full bg-white/[0.03] rounded-xl p-4 flex items-center justify-between text-xs text-gray-300 border border-white/5 font-raleway shadow-inner">
                <span className="uppercase tracking-wide text-white/70">Cache Size</span>
                <span className="font-mono font-bold text-emerald-300">0.00 KB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-950 shadow-2xl shadow-black/30">
          <CardHeader className="border-white/5">
            <CardTitle>Audit Log</CardTitle>
            <p className="text-xs text-cb-muted font-raleway">Transparent activity feed for the current session.</p>
          </CardHeader>
          <CardContent className="pt-5 space-y-6">
            <div className="space-y-3">
               <div className="flex items-start gap-4 text-sm p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 transition">
                  <div className="mt-0.5 p-2 bg-slate-800/60 rounded-lg border border-white/5"><Database className="w-4 h-4 text-gray-300" /></div>
                  <div className="space-y-1">
                    <p className="font-semibold text-white font-raleway">System Init</p>
                    <p className="text-gray-500 text-xs font-raleway">Secure environment ready.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 text-sm p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 transition">
                  <div className="mt-0.5 p-2 bg-cb-primary/10 rounded-lg border border-cb-primary/30"><Lock className="w-4 h-4 text-cb-primary" /></div>
                  <div className="space-y-1">
                    <p className="font-semibold text-white font-raleway">Encryption Active</p>
                    <p className="text-gray-500 text-xs font-raleway">TLS 1.3 enforced.</p>
                  </div>
               </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <Button variant="destructive" className="w-full gap-2 py-3 text-sm font-semibold tracking-wide rounded-lg">
                <Trash2 className="w-4 h-4" /> Purge Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-950 shadow-xl">
         <CardHeader className="border-white/5">
           <CardTitle>Standards</CardTitle>
           <p className="text-xs text-cb-muted font-raleway">Guidelines we uphold for every analysis.</p>
         </CardHeader>
         <CardContent className="pt-5">
           <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-200 font-raleway">
             <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02] flex flex-col gap-2 shadow-inner">
               <div className="text-xs font-semibold text-cb-primary uppercase tracking-wide">PIPEDA</div>
               <p className="text-gray-400 leading-relaxed">Client data is isolated per session with strict access controls.</p>
             </div>
             <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02] flex flex-col gap-2 shadow-inner">
               <div className="text-xs font-semibold text-cb-primary uppercase tracking-wide">Zero Retention</div>
               <p className="text-gray-400 leading-relaxed">LLM processing happens in-memory with no persistence of PII.</p>
             </div>
             <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02] flex flex-col gap-2 shadow-inner">
               <div className="text-xs font-semibold text-cb-primary uppercase tracking-wide">Canadian Residency</div>
               <p className="text-gray-400 leading-relaxed">Data remains within Canadian jurisdictions to satisfy residency rules.</p>
             </div>
           </div>
         </CardContent>
      </Card>
    </div>
  );
};