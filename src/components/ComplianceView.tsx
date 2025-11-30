
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ShieldCheck, Database, Trash2, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ComplianceView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-[fade-in_0.5s_ease-out] pb-10">
      <div className="mb-6 md:mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-prata heading-gold mb-2">Compliance Center</h2>
        <p className="text-sm text-cb-muted font-raleway">Manage retention policies, view logs, and verify PIPEDA status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border-l-2 border-green-500/50">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-900/20 rounded-full flex items-center justify-center text-green-400 mb-6 border border-green-500/20">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="font-prata font-bold text-white text-lg md:text-xl">Strictly Ephemeral</h3>
              <p className="text-xs md:text-sm text-gray-400 mt-2 mb-8 font-raleway max-w-xs mx-auto">
                Documents processed in memory. No PII storage on servers.
              </p>
              <div className="w-full bg-white/[0.03] rounded-lg p-4 flex justify-between text-xs text-gray-400 border border-white/5 font-raleway">
                <span>Cache Size</span>
                <span className="font-mono font-bold text-green-400">0.00 KB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
               <div className="flex items-start gap-4 text-sm p-2 rounded-lg hover:bg-white/[0.02]">
                  <div className="mt-1 p-1.5 bg-gray-800/50 rounded-md"><Database className="w-4 h-4 text-gray-400" /></div>
                  <div>
                    <p className="font-semibold text-white font-raleway">System Init</p>
                    <p className="text-gray-500 text-xs font-raleway mt-0.5">Secure environment ready.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 text-sm p-2 rounded-lg hover:bg-white/[0.02]">
                  <div className="mt-1 p-1.5 bg-cb-primary/10 rounded-md"><Lock className="w-4 h-4 text-cb-primary" /></div>
                  <div>
                    <p className="font-semibold text-white font-raleway">Encryption Active</p>
                    <p className="text-gray-500 text-xs font-raleway mt-0.5">TLS 1.3 enforced.</p>
                  </div>
               </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="w-4 h-4" /> Purge Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
         <CardHeader>
           <CardTitle>Standards</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="prose prose-sm prose-invert max-w-none text-gray-400 text-xs md:text-sm font-raleway">
             <p>
               Compliant with <strong className="text-white">PIPEDA</strong> & LSO guidelines.
             </p>
             <ul className="list-disc pl-4 mt-2 space-y-1.5 marker:text-cb-primary">
               <li>Client data isolated per session.</li>
               <li>Zero-Retention LLM processing.</li>
               <li>Canadian Data Residency.</li>
             </ul>
           </div>
         </CardContent>
      </Card>
    </div>
  );
};
