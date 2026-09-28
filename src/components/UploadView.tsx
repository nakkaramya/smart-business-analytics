import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  Table,
  SlidersHorizontal,
  Info,
  Layers,
  Calendar,
  DollarSign,
  Hash
} from 'lucide-react';
import { BusinessRecord, CleaningSummary, ColumnProfile, RawRow } from '../types/data';

interface UploadViewProps {
  onAnalyzeData: () => void;
  onUploadCSV: (csvText: string, deduplicate: boolean) => void;
  onLoadSample: () => void;
  rawRows: RawRow[];
  headers: string[];
  columnProfiles: ColumnProfile[];
  cleaningSummary: CleaningSummary | null;
  records: BusinessRecord[];
  isProcessing: boolean;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onAnalyzeData,
  onUploadCSV,
  onLoadSample,
  rawRows,
  headers,
  columnProfiles,
  cleaningSummary,
  records,
  isProcessing,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [deduplicate, setDeduplicate] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop & selection
  const handleFile = (file: File) => {
    if (!file) return;
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setErrorMessage('Please upload a valid .csv file format.');
      return;
    }
    setErrorMessage(null);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onUploadCSV(text, deduplicate);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'date':
        return <Calendar className="w-3.5 h-3.5 text-blue-500" />;
      case 'currency':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-500" />;
      case 'numeric':
        return <Hash className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          CSV Upload & Data Validation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your business dataset in CSV format. The system automatically inspects schemas, audits quality, and handles missing or invalid values.
        </p>
      </div>

      {/* Upload Box / Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/70 scale-[0.99]'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/80 bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Drag and drop your business CSV here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="text-indigo-600 font-semibold underline">browse from your computer</span>
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>Supports headers:</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Date</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Product</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Category</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Quantity</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Sales</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Cost</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Location</span>
            </div>

            {uploadedFileName && (
              <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs px-3 py-1.5 rounded-lg">
                <FileText className="w-3.5 h-3.5" />
                <span className="font-semibold">{uploadedFileName}</span>
                <span className="text-indigo-500">({rawRows.length} rows loaded)</span>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Sample Data & Cleaning Options */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Quick Test with Sample Data
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Don’t have a CSV on hand? Load our multi-month sample dataset from “Brew & Bean Co.” with authentic products, locations, and seasonal patterns.
            </p>
            <button
              onClick={() => {
                setUploadedFileName('brew_and_bean_sample.csv');
                onLoadSample();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Try Sample Data</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              Cleaning Configurations
            </h4>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={deduplicate}
                onChange={(e) => {
                  setDeduplicate(e.target.checked);
                  if (rawRows.length > 0) {
                    // Re-trigger with existing parsed state
                    const csvContent = PapaToCsv(rawRows);
                    onUploadCSV(csvContent, e.target.checked);
                  }
                }}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs text-slate-600 leading-tight">
                <strong className="text-slate-800 block">Remove duplicate rows</strong>
                Filter out exact repeat transactions before computing metrics.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Audit & Cleaning Report (Section 8) */}
      {cleaningSummary && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900">Data Cleaning & Audit Report</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every transformation applied to your dataset is logged transparently below:
              </p>
            </div>

            {/* Main CTA: Analyze Data */}
            <button
              onClick={onAnalyzeData}
              disabled={records.length === 0}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Analyze Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Total Rows Ingested</span>
              <span className="text-lg font-bold text-slate-900">{cleaningSummary.totalRows.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Columns Detected</span>
              <span className="text-lg font-bold text-slate-900">{cleaningSummary.totalColumns}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Duplicates Handled</span>
              <span className="text-lg font-bold text-amber-600">{cleaningSummary.duplicateRowsFound}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Clean Usable Rows</span>
              <span className="text-lg font-bold text-emerald-600">{cleaningSummary.validRows.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions Applied Log */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Transformations Performed:</h4>
            <div className="flex flex-wrap gap-2">
              {cleaningSummary.actionsApplied.map((act, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {act}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detected Columns & Data Types */}
      {columnProfiles.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Schema & Column Profiling</h3>
              <p className="text-xs text-slate-500">Detected types and missing value counts per field</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {columnProfiles.length} columns inspected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {columnProfiles.map((col) => (
              <div
                key={col.name}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 truncate" title={col.name}>
                    {col.name}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded capitalize">
                    {getTypeIcon(col.detectedType)}
                    <span>{col.detectedType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Unique values: <strong>{col.uniqueValues}</strong></span>
                  <span className={col.missingCount > 0 ? 'text-amber-600 font-semibold' : 'text-slate-400'}>
                    {col.missingCount} missing
                  </span>
                </div>

                {col.sampleValues.length > 0 && (
                  <div className="text-[10px] text-slate-400 truncate">
                    Samples: {col.sampleValues.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First Few Rows Preview Table (Section 2) */}
      {rawRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Raw Data Preview (First 8 Rows)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Showing 8 of {rawRows.length.toLocaleString()} total rows
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  {headers.map(h => (
                    <th key={h} className="py-2.5 px-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {rawRows.slice(0, 8).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 text-slate-400 font-sans">{idx + 1}</td>
                    {headers.map(h => (
                      <td key={h} className="py-2 px-3 text-slate-800 whitespace-nowrap">
                        {row[h] !== undefined && row[h] !== null && String(row[h]).trim() !== ''
                          ? String(row[h])
                          : <span className="text-amber-500 font-sans italic">missing</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Ready to generate intelligence and charts?
            </div>
            <button
              onClick={onAnalyzeData}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Analyze Data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple utility to convert rawRows back to CSV string
function PapaToCsv(rows: RawRow[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  rows.forEach(r => {
    const vals = headers.map(h => {
      const val = r[h] ?? '';
      return String(val).includes(',') ? `"${val}"` : String(val);
    });
    lines.push(vals.join(','));
  });
  return lines.join('\n');
}
