import React from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  ShieldAlert, 
  MessageSquareCode, 
  FileSpreadsheet,
  Zap,
  BarChart2
} from 'lucide-react';
import { NavTab } from './Navbar';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onLoadSample: () => void;
  hasData: boolean;
  recordCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onLoadSample,
  hasData,
  recordCount,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Upload',
      desc: 'Drag & drop any standard business CSV. We auto-detect columns, inspect data types, and cleanse anomalies.',
      badge: 'CSV Ingestion',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'Analyze',
      desc: 'The engine calculates exact sales, cost margins, volume trends, and group-by distributions instantly.',
      badge: 'Data Processing',
      icon: TrendingUp,
    },
    {
      step: '03',
      title: 'Understand',
      desc: 'Discover your highest grossing items, underperforming categories, and statistical sales anomalies.',
      badge: 'Automated Insights',
      icon: Zap,
    },
    {
      step: '04',
      title: 'Act',
      desc: 'Apply practical inventory, pricing, and merchandising suggestions to protect margins and boost cashflow.',
      badge: 'Business Decisions',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-8 sm:pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Small Business Data Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          BizInsight Agent
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto font-medium">
          “Turn your business data into simple, actionable insights.”
        </p>

        <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
          No complex data warehouse required. Upload your daily sales or inventory CSV to immediately unlock executive KPI dashboards, automated anomaly alerts, and conversational answers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Business Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLoadSample}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 hover:border-slate-400 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Try Sample Data</span>
            <span className="text-xs text-slate-400 font-normal">(Instant Demo)</span>
          </button>

          <button
            onClick={() => onNavigate('n8n')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>Open n8n Chatbot</span>
          </button>
        </div>

        {hasData && (
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{recordCount.toLocaleString()} cleaned transactions ready to view</span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="underline font-semibold ml-1 hover:text-emerald-900"
            >
              Open Dashboard →
            </button>
          </div>
        )}
      </section>

      {/* 4-Step Process Section: Upload -> Analyze -> Understand -> Act */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-600">The 4-Step Workflow</h2>
          <p className="mt-1 text-2xl font-bold text-slate-900">Upload → Analyze → Understand → Act</p>
          <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            A reliable data pipeline built for shop owners, operators, and managers without requiring an in-house data analyst.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(s => {
            const Icon = s.icon;
            return (
              <div 
                key={s.step}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-indigo-500 transition-colors">
                      {s.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {s.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Feature Highlights */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Visual Sales Dashboards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter by date, store location, category, or product. Interactive trend lines, bar comparisons, and margin breakdowns that respond on the fly.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Statistical Anomaly Detection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Flags sudden sales plunges, unexpected demand surges, and quantity volume outliers using rigorous standard deviation thresholds.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Ask BizInsight Agent</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ask natural questions like “Which product has the highest sales?” or “What is our profit margin?” and get deterministic answers backed by reliable data tools.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FileSpreadsheet className="w-4 h-4 text-slate-300" />
              <span>Supported fields: Date, Product, Category, Quantity, Sales, Cost, Location, Customer Type</span>
            </div>
            <button
              onClick={onLoadSample}
              className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 underline flex items-center gap-1"
            >
              Load Demo Dataset (Brew & Bean Co.) →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
