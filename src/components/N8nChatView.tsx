import React, { useState } from 'react';
import { 
  Bot, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { BusinessRecord } from '../types/data';

interface N8nChatViewProps {
  records: BusinessRecord[];
}

export const N8nChatView: React.FC<N8nChatViewProps> = ({ records }) => {
  const webhookUrl = "https://ramya9676.app.n8n.cloud/webhook/98a47225-b4e0-4f61-b3bd-997dc05ae3fe/chat";
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Bot className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">n8n Cloud Workflow Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            n8n AI Business Chatbot
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full-screen interactive session connected to your live n8n workflow webhook.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            title="Reload Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reload</span>
          </button>

          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            title="Copy Webhook URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy Webhook'}</span>
          </button>

          <a
            href={webhookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Integration Status Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Webhook Status:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Connected & Active
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xl font-mono">
              {webhookUrl}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{records.length} business records ready for analysis context</span>
        </div>
      </div>

      {/* Main Full-Size Chatbot Frame */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[700px] min-h-[500px]">
        {/* Frame Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">n8n Business Intelligence Agent</span>
              <span className="text-[10px] text-slate-400">ramya9676.app.n8n.cloud</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
              Live Stream
            </span>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className="flex-1 w-full h-full relative bg-slate-50">
          <iframe
            key={iframeKey}
            src={webhookUrl}
            title="n8n Business Intelligence Chatbot"
            className="w-full h-full border-0"
            allow="clipboard-write; microphone"
          />
        </div>
      </div>
    </div>
  );
};
