import React from 'react';
import { RarityLevel } from '../types';

interface Props {
  level: RarityLevel;
}

const RarityBadge: React.FC<Props> = ({ level }) => {
  let colors = '';
  let icon = '';

  switch (level) {
    case RarityLevel.ULTRA_RARE:
      colors = 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]';
      icon = '💎';
      break;
    case RarityLevel.RARE:
      colors = 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
      icon = '🔥';
      break;
    case RarityLevel.COMMON:
      colors = 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      icon = '🙂';
      break;
    default:
      colors = 'bg-slate-700/50 text-slate-400 border-slate-600';
      icon = '❌';
      break;
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${colors} font-bold uppercase text-sm tracking-wider`}>
      <span>{icon}</span>
      <span>{level}</span>
    </div>
  );
};

export default RarityBadge;