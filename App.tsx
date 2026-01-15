import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Copy, RefreshCw, BarChart2, Globe } from 'lucide-react';
import { analyzeUsername, checkAvailability, getSuggestions } from './utils/scoring';
import { AnalysisResult, PlatformAvailability, Suggestion, RarityLevel } from './types';
import RarityBadge from './components/RarityBadge';
import ScoreGauge from './components/ScoreGauge';
import SuggestionCard from './components/SuggestionCard';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [availability, setAvailability] = useState<PlatformAvailability[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setIsAnimating(true);
    
    // Simulate processing delay for "hacker/AI" feel
    setTimeout(() => {
      const res = analyzeUsername(input.trim());
      setResult(res);
      setAvailability(checkAvailability(input.trim()));
      setSuggestions(getSuggestions(res));
      setIsAnimating(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const copyMain = () => {
    navigator.clipboard.writeText(input);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  // Reset copy feedback if input changes
  useEffect(() => {
    setCopiedMain(false);
  }, [input]);

  return (
    <div className="min-h-screen pb-20 px-4 md:px-0 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 font-sans selection:bg-gaming-neon selection:text-black">
      
      {/* Navbar / Header */}
      <header className="max-w-4xl mx-auto pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gaming-neon to-gaming-accent flex items-center justify-center shadow-lg shadow-gaming-neon/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">ID_CHECKER</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Premium Rarity Tool</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        
        {/* Search Section */}
        <section className="relative">
          <div className="relative group z-10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter username (e.g., 144fps, ishq, no1)..."
              className="w-full bg-slate-900/80 border-2 border-slate-800 text-white text-xl md:text-2xl px-6 py-5 rounded-2xl focus:outline-none focus:border-gaming-neon focus:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all placeholder:text-slate-600 font-mono"
            />
            <button
              onClick={handleAnalyze}
              className="absolute right-3 top-3 bottom-3 bg-slate-800 hover:bg-slate-700 text-gaming-neon px-6 rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-700 hover:border-gaming-neon group-focus-within:bg-gaming-neon group-focus-within:text-black group-focus-within:border-transparent"
            >
              {isAnimating ? <RefreshCw className="animate-spin" /> : <Search size={20} />}
              <span className="hidden md:inline">ANALYZE</span>
            </button>
          </div>
          {/* Decorative glow behind input */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gaming-accent to-gaming-neon rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 -z-10"></div>
        </section>

        {result && (
          <div className={`space-y-6 transition-all duration-500 ${isAnimating ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
            
            {/* Main Score Card */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <BarChart2 size={120} />
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="flex-shrink-0">
                  <ScoreGauge score={result.score} />
                </div>

                <div className="flex-grow space-y-4 text-center md:text-left w-full">
                  <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tighter">{result.username}</h2>
                      <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                         {result.tags.map(tag => (
                           <span key={tag} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{tag}</span>
                         ))}
                      </div>
                    </div>
                    <RarityBadge level={result.rarity} />
                  </div>

                  <div className="h-px bg-slate-800 w-full" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-slate-400 text-xs uppercase font-bold mb-2">Analysis</h3>
                      <ul className="space-y-1">
                        {result.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-gaming-neon mt-1">•</span> {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-slate-400 text-xs uppercase font-bold mb-2">Actions</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={copyMain}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {copiedMain ? <span className="text-green-400">Copied!</span> : <><Copy size={14} /> Copy Name</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Availability Estimator */}
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="text-gaming-neon" size={18} />
                  <h3 className="font-bold text-white">Availability Prediction</h3>
                </div>
                <div className="space-y-3">
                  {availability.map((plat) => (
                    <div key={plat.platform} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                      <span className="text-slate-300 font-medium">{plat.platform}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${plat.probability > 70 ? 'bg-green-500' : plat.probability < 40 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${plat.probability}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-24 text-right ${plat.status === 'Likely Taken' ? 'text-red-400' : plat.status === 'Likely Available' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {plat.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-4 text-center">
                  *Estimations based on length, pattern rarity, and dictionary matching. Not a real-time API check.
                </p>
              </div>

              {/* Suggestions */}
              <div className="glass-panel rounded-2xl p-6 border-gaming-accent/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-gaming-accent" size={18} />
                  <h3 className="font-bold text-white">Premium Alternatives</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((sug, i) => (
                    <SuggestionCard 
                      key={i} 
                      suggestion={sug} 
                      onSelect={(val) => {
                        setInput(val);
                        handleAnalyze();
                      }} 
                    />
                  ))}
                </div>
                {suggestions.length === 0 && (
                   <div className="text-center text-slate-500 text-sm py-8">No specific alternatives found for this style.</div>
                )}
              </div>

            </div>
          </div>
        )}

        {!result && (
          <div className="text-center mt-20 space-y-4">
             <div className="inline-flex gap-4 opacity-30 grayscale">
                <span className="text-4xl">💎</span>
                <span className="text-4xl">🔥</span>
                <span className="text-4xl">🎮</span>
             </div>
             <h3 className="text-slate-500 font-medium">Enter a username to detect rarity, style, and worth.</h3>
             <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
               {['10cm', 'op', 'ishq', '144fps', 'rush'].map(ex => (
                 <button key={ex} onClick={() => { setInput(ex); setTimeout(handleAnalyze, 100); }} className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 hover:text-gaming-neon hover:border-gaming-neon transition-colors">
                   {ex}
                 </button>
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}