import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Bot, 
  Table, 
  ArrowUpRight,
  Database,
  Cpu,
  Layers
} from 'lucide-react';
import { AgentQueryResult, BusinessRecord } from '../types/data';
import { AgentEngine, PREDEFINED_QUESTIONS } from '../services/agentEngine';

interface AskBizInsightViewProps {
  records: BusinessRecord[];
}

export const AskBizInsightView: React.FC<AskBizInsightViewProps> = ({ records }) => {
  const [questionInput, setQuestionInput] = useState('');
  const [history, setHistory] = useState<AgentQueryResult[]>(() => {
    // Seed with a default initial answer on load
    if (records.length > 0) {
      return [AgentEngine.askQuestion('What are my top 5 products?', records)];
    }
    return [];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAsk = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    // Simulate brief agent parsing / tool dispatching for realistic feel
    setTimeout(() => {
      const result = AgentEngine.askQuestion(trimmed, records);
      setHistory(prev => [result, ...prev]);
      setQuestionInput('');
      setIsSubmitting(false);
    }, 200);
  };

  const handlePredefinedClick = (qText: string) => {
    handleAsk(qText);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-14">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <Bot className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Deterministic Data Agent</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ask BizInsight Agent
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Ask direct questions in natural language. The agent dispatches dedicated analysis tools to calculate exact mathematical answers.
        </p>
      </div>

      {/* Interactive Input Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(questionInput);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Ask a question about your business data (e.g., Which product has the highest sales?)..."
            className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50/50 pl-4 pr-24 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!questionInput.trim() || isSubmitting || records.length === 0}
            className="absolute right-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3 h-3" />
          </button>
        </form>

        {/* Predefined One-Click Questions (Section 6) */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Predefined Analytical Prompts (One-Click)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => handlePredefinedClick(q.question)}
                disabled={records.length === 0}
                className="text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl transition-all text-left flex items-center gap-1.5"
              >
                <span>{q.question}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Workflow Explanation Banner (Section 14 & 15) */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 sm:p-5 text-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Agent-Ready Architecture: Tool-Based Grounding</div>
            <div className="text-[11px] text-slate-400">
              User Question → Intent Extraction → Analysis Tool Calculation → Structured Answer (Zero Hallucinations)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Strict Numerical Precision</span>
        </div>
      </div>

      {/* Answer History Feed */}
      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Ask a question above or click any prompt to see the agent in action.
          </div>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-indigo-200 transition-all"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    Q
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {item.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 self-start sm:self-center">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.answeredAt}</span>
                  {item.badge && (
                    <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Natural Language Answer */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>BizInsight Synthesis:</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-sans">
                  {item.answerSummary}
                </p>
              </div>

              {/* Detailed Metrics Key-Value Grid */}
              {item.detailedData && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
                  {Object.entries(item.detailedData).map(([key, val]) => (
                    <div key={key} className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block truncate" title={key}>{key}</span>
                      <strong className="text-xs text-slate-900 font-mono block mt-0.5">{String(val)}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Structured Output Table if present */}
              {item.tableData && item.tableData.length > 0 && (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-100/70 px-3 py-1.5 text-[11px] font-semibold text-slate-700 border-b border-slate-200 flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-slate-500" />
                    <span>Calculated Tool Output</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 font-medium text-[10px] uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          {Object.keys(item.tableData[0]).map(col => (
                            <th key={col} className="py-2 px-3 whitespace-nowrap">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {item.tableData.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/60">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="py-1.5 px-3 whitespace-nowrap text-slate-800">
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tool Execution Trace & Formula Footnote */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                <div className="flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3 h-3 text-slate-500" />
                  <span>Tool: <code className="text-slate-600">{item.toolUsed}</code></span>
                </div>
                {item.calculatedFormula && (
                  <div className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Formula: {item.calculatedFormula}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
