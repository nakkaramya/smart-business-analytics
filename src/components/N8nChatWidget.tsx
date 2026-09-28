import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Minimize2, 
  Maximize2,
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface N8nChatbotProps {
  webhookUrl?: string;
  defaultOpen?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
}

export const N8nChatWidget: React.FC<N8nChatbotProps> = ({
  webhookUrl = 'https://ramya9676.app.n8n.cloud/webhook/98a47225-b4e0-4f61-b3bd-997dc05ae3fe/chat',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [useIframe, setUseIframe] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your AI Business Assistant connected to your n8n workflow. How can I help analyze your business data today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || isLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: time,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send directly to the n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          chatInput: cleanText,
          message: cleanText,
          action: 'sendMessage',
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to reach n8n assistant`);
      }

      const data = await response.json();
      
      // Parse flexible response structure from n8n
      let botReply = '';
      if (typeof data === 'string') {
        botReply = data;
      } else if (data.output) {
        botReply = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
      } else if (data.text) {
        botReply = data.text;
      } else if (data.message) {
        botReply = data.message;
      } else if (data.response) {
        botReply = data.response;
      } else if (Array.isArray(data) && data[0]?.output) {
        botReply = data[0].output;
      } else {
        botReply = JSON.stringify(data, null, 2);
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply || 'I received your query and processed it through the workflow.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.warn('Direct n8n webhook API fetch issue:', err);
      // Fallback message with instruction to view via iframe or direct link
      setMessages(prev => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'bot',
          text: `Message dispatched to n8n webhook. If your n8n webhook uses standard chat UI rendering, switch to the "Embedded n8n Chat" tab above.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">Ask n8n AI Chatbot</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle n8n Chat"
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center relative group"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6 transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">n8n Business Agent</h3>
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  ramya9676.app.n8n.cloud
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setUseIframe(!useIframe)}
                title={useIframe ? "Switch to Native Chat UI" : "Switch to Embedded n8n Chat"}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  useIframe ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <a
                href={webhookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new window"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Banner */}
          <div className="bg-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-600 border-b border-slate-200">
            <span className="text-[11px] font-medium">
              Mode: <strong className="text-slate-800">{useIframe ? 'Embedded n8n Chat Interface' : 'Native Interactive API'}</strong>
            </span>
            <button
              onClick={() => setUseIframe(!useIframe)}
              className="text-[11px] text-indigo-600 font-semibold hover:underline"
            >
              Switch to {useIframe ? 'Native UI' : 'n8n Embed'}
            </button>
          </div>

          {/* Content: Either n8n Live Hosted Webhook iFrame OR Native Interactive Component */}
          {useIframe ? (
            <div className="flex-1 w-full h-full relative bg-slate-50">
              <iframe
                src={webhookUrl}
                title="n8n Chat Assistant"
                className="w-full h-full border-0"
                allow="clipboard-write"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/50">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                        m.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 p-2.5 rounded-2xl w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>n8n AI agent is responding...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask n8n workflow about your business..."
                  disabled={isLoading}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Footer note */}
          <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <span>Powered by n8n Workflow Automation</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Cloud Webhook Connected</span>
          </div>
        </div>
      )}
    </>
  );
};
