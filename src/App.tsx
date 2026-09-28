/**
 * BizInsight Agent - Main Application
 * 
 * Pipeline:
 * CSV Upload -> Data Validation -> Data Cleaning -> Data Analysis -> Insights -> User Question -> Analysis Tool -> Answer
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { UploadView } from './components/UploadView';
import { DashboardView } from './components/DashboardView';
import { AnalysisView } from './components/AnalysisView';
import { InsightsView } from './components/InsightsView';
import { AskBizInsightView } from './components/AskBizInsightView';
import { SAMPLE_CSV_RAW } from './utils/sampleData';
import { cleanAndProcessCSV } from './services/dataCleaner';
import { DataEngine } from './services/dataEngine';
import { BusinessRecord, CleaningSummary, ColumnProfile, DatasetStats, RawRow } from './types/data';
import { CheckCircle2, Database, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [records, setRecords] = useState<BusinessRecord[]>([]);
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnProfiles, setColumnProfiles] = useState<ColumnProfile[]>([]);
  const [cleaningSummary, setCleaningSummary] = useState<CleaningSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize with sample data so the app is instantly rich and testable
  useEffect(() => {
    handleProcessCSV(SAMPLE_CSV_RAW, true, false);
  }, []);

  const handleProcessCSV = (csvText: string, deduplicate = true, showToast = true) => {
    setIsProcessing(true);
    try {
      const result = cleanAndProcessCSV(csvText, deduplicate);
      setRecords(result.records);
      setRawRows(result.rawRows);
      setHeaders(result.headers);
      setColumnProfiles(result.columnProfiles);
      setCleaningSummary(result.cleaningSummary);

      if (showToast) {
        setNotification(`Successfully processed ${result.records.length} business records.`);
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error('CSV Parsing Error:', err);
      setNotification('Failed to parse CSV. Please verify file formatting.');
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = () => {
    handleProcessCSV(SAMPLE_CSV_RAW, true, true);
    setNotification('Loaded sample dataset: Brew & Bean Co. (110+ sales records)');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAnalyzeData = () => {
    setCurrentTab('dashboard');
  };

  // Pre-calculate top-level stats
  const stats: DatasetStats = React.useMemo(() => {
    return DataEngine.computeDatasetStats(records);
  }, [records]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        recordCount={records.length}
        onLoadSample={handleLoadSample}
        hasData={records.length > 0}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={setCurrentTab}
            onLoadSample={() => {
              handleLoadSample();
              setCurrentTab('dashboard');
            }}
            hasData={records.length > 0}
            recordCount={records.length}
          />
        )}

        {currentTab === 'upload' && (
          <UploadView
            onAnalyzeData={handleAnalyzeData}
            onUploadCSV={(csv, dedup) => handleProcessCSV(csv, dedup, true)}
            onLoadSample={handleLoadSample}
            rawRows={rawRows}
            headers={headers}
            columnProfiles={columnProfiles}
            cleaningSummary={cleaningSummary}
            records={records}
            isProcessing={isProcessing}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            records={records}
            stats={stats}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'analysis' && (
          <AnalysisView records={records} />
        )}

        {currentTab === 'insights' && (
          <InsightsView
            records={records}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'ask' && (
          <AskBizInsightView records={records} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">BizInsight Agent</span>
            <span>—</span>
            <span>Data Science & Analysis Prototype for Small Businesses</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Session In-Memory Processing</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Deterministic Precision</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
