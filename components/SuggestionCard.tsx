import React from 'react';
import { Suggestion } from '../types';
import { Copy } from 'lucide-react';

interface Props {
  suggestion: Suggestion;
  onSelect: (val: string) => void;
}

const SuggestionCard: React.FC<Props> = ({ suggestion, onSelect }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(suggestion.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      onClick={() => onSelect(suggestion.username)}
      className="group relative flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-gaming-neon hover:bg-slate-800 transition-all cursor-pointer"
    >
      <div>
        <div className="text-white font-mono font-medium">{suggestion.username}</div>
        <div className="text-xs text-slate-500">{suggestion.type}</div>
      </div>
      <button 
        onClick={handleCopy}
        className={`p-2 rounded-md transition-colors ${copied ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
      >
        <Copy size={16} />
      </button>
    </div>
  );
};

export default SuggestionCard;