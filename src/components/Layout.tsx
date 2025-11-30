import React, { useState } from 'react';
import { ShieldCheck, FileText, BarChart, Settings, Menu, X } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#030100] bg-cb-hero-radial text-cb-text flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Header */}
      <header className="md:hidden bg-cb-navy/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2" onClick={() => handleNavClick('upload')}>
          <ShieldCheck className="text-cb-primary w-6 h-6" />
          <span className="font-prata font-bold text-lg heading-gold tracking-wide">CustodyBuddy</span>
        </div>
        <button 
          className="text-gray-300 hover:text-cb-primary p-1 rounded-md active:bg-white/10 transition-colors" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#030100]/95 backdrop-blur-xl pt-20 px-4 animate-[fade-in_0.3s_ease-out]">
          <nav className="flex flex-col gap-2">
            <NavItem 
              icon={<FileText className="w-5 h-5" />} 
              label="Upload Document" 
              active={currentView === 'upload'} 
              onClick={() => handleNavClick('upload')} 
            />
            <NavItem 
              icon={<BarChart className="w-5 h-5" />} 
              label="Analysis Results" 
              active={currentView === 'dashboard'} 
              onClick={() => handleNavClick('dashboard')} 
            />
            <NavItem 
              icon={<Settings className="w-5 h-5" />} 
              label="Compliance & Logs" 
              active={currentView === 'compliance'} 
              onClick={() => handleNavClick('compliance')} 
            />
          </nav>
          
          <div className="mt-8 p-4 bg-cb-card rounded-lg border border-white/10">
            <h4 className="text-xs uppercase tracking-wider text-cb-primary font-raleway font-bold mb-2">System Status</h4>
            <div className="flex items-center gap-2 text-xs text-green-400 font-raleway">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              PIPEDA Secure
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-cb-navy text-white min-h-screen fixed left-0 top-0 border-r border-white/5 z-10">
        <div className="p-8 flex flex-col items-center gap-4 border-b border-white/5">
          <div className="bg-cb-primary/10 p-3 rounded-full backdrop-blur-sm shadow-cb-glow">
            <ShieldCheck className="text-cb-primary w-10 h-10" />
          </div>
          <div className="text-center">
            <h1 className="font-prata font-bold text-2xl heading-gold">CustodyBuddy</h1>
            <p className="text-xs text-cb-muted font-raleway mt-1 uppercase tracking-widest">Legal AI Assistant</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem 
            icon={<FileText className="w-5 h-5" />} 
            label="Upload Document" 
            active={currentView === 'upload'} 
            onClick={() => handleNavClick('upload')} 
          />
          <NavItem 
            icon={<BarChart className="w-5 h-5" />} 
            label="Analysis Results" 
            active={currentView === 'dashboard'} 
            onClick={() => handleNavClick('dashboard')} 
          />
          <NavItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Compliance & Logs" 
            active={currentView === 'compliance'} 
            onClick={() => handleNavClick('compliance')} 
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-cb-card p-4 rounded-lg border border-white/5">
            <h4 className="text-xs uppercase tracking-wider text-cb-primary font-raleway font-bold mb-2">Security Status</h4>
            <div className="flex items-center gap-2 text-xs text-green-400 font-raleway">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              PIPEDA Compliant
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-raleway">
              <span className="w-2 h-2 rounded-full bg-gray-600"></span>
              Ephemeral Mode
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 pt-20 md:pt-10 transition-all duration-300 w-full min-h-screen">
        <div className="max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-raleway ${
      active 
        ? 'bg-cb-primary/10 text-cb-primary border border-cb-primary/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon}
    <span className={active ? 'font-semibold' : 'font-medium'}>{label}</span>
  </button>
);