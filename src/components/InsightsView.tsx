import React, { useMemo } from 'react';
import { 
  Lightbulb, 
  ShieldAlert, 
  Compass, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  Tag,
  ArrowRight,
  Info
} from 'lucide-react';
import { BusinessRecord } from '../types/data';
import { InsightsEngine } from '../services/insightsEngine';
import { AnomalyDetector } from '../services/anomalyDetector';
import { NavTab } from './Navbar';

interface InsightsViewProps {
  records: BusinessRecord[];
  onNavigate: (tab: NavTab) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ records, onNavigate }) => {
  const insights = useMemo(() => InsightsEngine.generateInsights(records), [records]);
  const anomalies = useMemo(() => AnomalyDetector.detectAnomalies(records), [records]);
  const suggestions = useMemo(() => InsightsEngine.generateSuggestions(records), [records]);

  if (records.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lightbulb className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Insights to Generate</h3>
        <p className="text-sm text-slate-500">
          Upload a business CSV or try the sample data to generate automated data-driven insights and anomaly detection.
        </p>
        <button
          onClick={() => onNavigate('upload')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-14">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Business Insights & Anomaly Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Calculated dynamically from your transaction baseline — no hardcoded statements.
        </p>
      </div>

      {/* SECTION 1: Business Insights (Prompt Section 5) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Calculated Business Insights</h2>
              <p className="text-xs text-slate-500">Key trends, leaders, and growth velocity</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
            {insights.length} Insights Uncovered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {insights.map((item) => {
            const isSuccess = item.type === 'success';
            const isWarning = item.type === 'warning';
            const isOpportunity = item.type === 'opportunity';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isSuccess
                    ? 'border-emerald-200/80 hover:border-emerald-300'
                    : isWarning
                    ? 'border-amber-200/80 hover:border-amber-300'
                    : isOpportunity
                    ? 'border-indigo-200/80 hover:border-indigo-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSuccess
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : isOpportunity
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.tag}
                    </span>

                    {item.metric && (
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {item.metric}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.description}</p>
                </div>

                {item.dataPoint && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Key Data Metric:</span>
                    <strong className="text-slate-800">{item.dataPoint}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Anomaly Detection / Unusual Activity (Prompt Section 7) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Unusual Activity (Anomaly Detection)</h2>
              <p className="text-xs text-slate-500">
                Statistical anomalies flagged via standard deviation (|z| &gt; 1.8) and moving averages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-medium">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Possible anomalies — not definite problems</span>
          </div>
        </div>

        {anomalies.length === 0 ? (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 text-center text-xs text-emerald-800">
            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <strong className="block text-sm font-bold">No Unusual Fluctuations Detected</strong>
            All daily sales numbers and ordering quantities in this dataset are within typical statistical variations.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalies.map((anom) => {
              const isHigh = anom.severity === 'high';
              const isDrop = anom.type === 'sudden_drop';

              return (
                <div
                  key={anom.id}
                  className={`bg-white rounded-2xl p-5 border shadow-xs transition-all ${
                    isHigh ? 'border-rose-200 hover:border-rose-300' : 'border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center ${
                          isDrop ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {isDrop ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{anom.title}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {anom.severity} Alert
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {anom.description}
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Actual Recorded</span>
                      <strong className="text-slate-900">
                        {anom.type.includes('quantity') ? `${anom.actualValue} units` : `$${anom.actualValue.toLocaleString()}`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Typical Baseline</span>
                      <strong className="text-slate-700">
                        {anom.type.includes('quantity') ? `${anom.expectedBaseline} units` : `$${anom.expectedBaseline.toLocaleString()}`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Variance</span>
                      <strong className={anom.deviationPercent < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {anom.deviationPercent > 0 ? `+${anom.deviationPercent}%` : `${anom.deviationPercent}%`}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 3: Business Suggestions (Prompt Section 9) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Business Suggestions</h2>
              <p className="text-xs text-slate-500">
                Data-based suggestions for inventory management, pricing, and merchandising.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Data-backed suggestions • Not guaranteed outcomes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {suggestions.map((sug) => {
            const isHigh = sug.priority === 'high';
            return (
              <div
                key={sug.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-200 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {sug.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{sug.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      isHigh ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold' : 'text-slate-500 bg-slate-50'
                    }`}
                  >
                    {sug.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/60">
                  {sug.recommendation}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-500 pt-1">
                  <div>
                    <strong className="text-slate-700 font-semibold">Analytical Rationale:</strong> {sug.rationale}
                  </div>
                  <div>
                    <strong className="text-emerald-700 font-semibold">Estimated Impact:</strong> {sug.potentialImpact}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prompt to Ask the Agent */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Have a specific question about these findings?</h3>
          <p className="text-xs text-slate-300 mt-1">
            Query the dataset directly using the Ask BizInsight Agent console.
          </p>
        </div>
        <button
          onClick={() => onNavigate('ask')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-900 transition-all flex items-center gap-2 shrink-0"
        >
          <span>Open Ask BizInsight</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
