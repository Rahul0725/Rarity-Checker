import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  score: number;
}

const ScoreGauge: React.FC<Props> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = '#94a3b8'; // default slate
  if (score >= 90) color = '#06b6d4'; // cyan
  else if (score >= 70) color = '#a855f7'; // purple
  else if (score >= 40) color = '#eab308'; // yellow

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={45}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell key="score" fill={color} />
            <Cell key="rest" fill="#1e293b" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-white font-mono">{Math.round(score)}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;