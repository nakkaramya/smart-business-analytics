import React from 'react';
import { 
  BarChart3, 
  UploadCloud, 
  LayoutDashboard, 
  TrendingUp, 
  Lightbulb, 
  HelpCircle, 
  Database,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export type NavTab = 'home' | 'upload' | 'dashboard' | 'analysis' | 'insights' | 'ask';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  recordCount: number;
  onLoadSample: () => void;
  hasData: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  recordCount,
  onLoadSample,
  hasData,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: BarChart3 },
    { id: 'upload', label: 'Upload & Clean', icon: UploadCloud },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', label: 'Sales Analysis', icon: TrendingUp },
    { id: 'insights', label: 'Insights & Anomalies', icon: Lightbulb },
    { id: 'ask', label: 'Ask BizInsight', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">BizInsight</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Small Business Data Intelligence</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Data Indicator */}
          <div className="flex items-center gap-2.5">
            {hasData ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {recordCount.toLocaleString()} rows active
                </span>
                <button
                  onClick={() => onSelectTab('upload')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  title="Upload another CSV"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">New CSV</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Sample Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Scrollbar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
