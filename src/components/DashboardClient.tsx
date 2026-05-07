"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, History, ChevronRight, CheckCircle2, AlertTriangle, LayoutTemplate, Clock, Loader2, Plus } from 'lucide-react';

type AnalysisResult = {
  id?: string;
  created_at?: string;
  summary: string;
  missing_pieces: string[];
  next_tasks: string[];
  risks: string[];
  roadmap: { day: string; task: string }[];
};

export default function DashboardClient() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('analyses')
      .select('id, created_at, summary, raw_input')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) setHistory(data);
  };

  const loadHistoryItem = async (id: string) => {
    const { data } = await supabase.from('analyses').select('*').eq('id', id).single();
    if (data) {
      setInput(data.raw_input);
      setResult({
        summary: data.summary,
        missing_pieces: data.missing_pieces,
        next_tasks: data.next_tasks,
        risks: data.risks,
        roadmap: data.roadmap
      });
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) throw new Error('Analysis failed');

      const data = await res.json();
      const analysisData = data.analysis;

      setResult(analysisData);

      // Save to Supabase
      const { data: insertedData, error } = await supabase.from('analyses').insert([{
        raw_input: input,
        summary: analysisData.summary,
        missing_pieces: analysisData.missing_pieces,
        next_tasks: analysisData.next_tasks,
        risks: analysisData.risks,
        roadmap: analysisData.roadmap
      }]).select();

      if (insertedData) {
        setHistory([insertedData[0], ...history]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to analyze. Please check your API key and network.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* Sidebar */}
      <motion.div 
        initial={{ width: 300 }}
        animate={{ width: isSidebarOpen ? 300 : 0 }}
        className="flex-shrink-0 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white w-48">
            <LayoutTemplate size={18} className="text-blue-500 shrink-0" />
            <span className="truncate">Forge History</span>
          </div>
          <button onClick={() => { setInput(''); setResult(null); }} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white" title="New Project">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {history.length === 0 && (
            <div className="text-zinc-500 text-sm text-center p-4">No previous projects</div>
          )}
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => loadHistoryItem(item.id)}
              className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group flex items-start gap-3"
            >
              <History size={16} className="text-zinc-500 mt-0.5 group-hover:text-blue-400 transition-colors shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-300 truncate">{item.summary || "Untitled Project"}</p>
                <p className="text-xs text-zinc-600 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <header className="h-14 border-b border-white/5 flex items-center px-4 shrink-0 bg-transparent relative z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-md text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            <ChevronRight size={18} className={`transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">{isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Input Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-2xl font-bold text-white">What are you building?</h2>
              <p className="text-zinc-400">Dump your thoughts, brain dumps, or README drafts below.</p>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="I want to build a tool that..."
                  className="w-full h-48 p-4 glass-input resize-none text-base leading-relaxed text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-500/50"
                />
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !input.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-md font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                  >
                    {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {isAnalyzing ? "Analyzing..." : "Analyze Project"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 pt-8"
                >
                  <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-white/10 pb-4 text-white">
                    <LayoutTemplate size={20} className="text-blue-500" />
                    Execution Plan
                  </h3>

                  {/* Summary */}
                  <div className="glass-card p-6">
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Project Summary</h4>
                    <p className="text-lg leading-relaxed text-zinc-200">{result.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Tasks */}
                    <div className="glass-card p-6 border-l-2 border-l-green-500/50 hover:border-l-green-500 transition-colors">
                      <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        Next Tasks
                      </h4>
                      <ul className="space-y-4">
                        {result.next_tasks.map((task, i) => (
                          <li key={i} className="flex gap-3 text-zinc-300">
                            <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                            <span className="leading-snug">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks */}
                    <div className="glass-card p-6 border-l-2 border-l-red-500/50 hover:border-l-red-500 transition-colors">
                      <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        Key Risks
                      </h4>
                      <ul className="space-y-3">
                        {result.risks.map((risk, i) => (
                          <li key={i} className="flex gap-3 text-zinc-300">
                            <span className="shrink-0 text-red-500 mt-1">•</span>
                            <span className="leading-snug">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Missing Pieces */}
                  <div className="glass-card p-6 border-l-2 border-l-yellow-500/50 hover:border-l-yellow-500 transition-colors">
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles size={16} className="text-yellow-500" />
                      Missing Pieces
                    </h4>
                    <ul className="space-y-3">
                      {result.missing_pieces.map((piece, i) => (
                        <li key={i} className="flex gap-3 text-zinc-300">
                           <span className="shrink-0 text-yellow-500 mt-1">•</span>
                           <span className="leading-snug">{piece}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Roadmap */}
                  <div className="glass-card p-6 border-l-2 border-l-blue-500/50 hover:border-l-blue-500 transition-colors">
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      7-Day Roadmap
                    </h4>
                    <div className="space-y-6">
                      {result.roadmap.map((item, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="w-16 shrink-0 text-sm font-semibold text-blue-400 pt-0.5">{item.day}</div>
                          <div className="flex-1 pb-6 border-b border-white/5 group-last:border-0 group-last:pb-0">
                            <p className="text-zinc-300 leading-relaxed">{item.task}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
