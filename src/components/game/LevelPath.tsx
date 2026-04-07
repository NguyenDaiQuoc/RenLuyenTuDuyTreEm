import React from 'react';

interface Level {
  position: { x: number; y: number }; // x is %, y is px
}

interface LevelPathProps {
  levels: Level[];
}

export const LevelPath: React.FC<LevelPathProps> = ({ levels }) => {
  const totalHeight = levels.length > 0 ? Math.max(...levels.map(l => l.position.y)) + 200 : 600;

  // Generate a smooth path using the level positions
  const generatePath = () => {
    if (levels.length === 0) return "";
    let d = `M ${levels[0].position.x}% ${levels[0].position.y}px`;
    for (let i = 1; i < levels.length; i++) {
      const prev = levels[i - 1];
      const curr = levels[i];
      const cp1y = prev.position.y + (curr.position.y - prev.position.y) / 2;
      const cp2y = cp1y;
      d += ` C ${prev.position.x}% ${cp1y}px, ${curr.position.x}% ${cp2y}px, ${curr.position.x}% ${curr.position.y}px`;
    }
    return d;
  };

  return (
    <div className="absolute top-0 left-0 w-full -z-10 pointer-events-none" style={{ height: totalHeight }}>
      <svg className="w-full h-full" preserveAspectRatio="none">
        <path
          d={generatePath()}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-slate-100 dark:text-slate-900 transition-colors"
        />
        <path
          d={generatePath()}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="1 20"
          className="text-slate-200 dark:text-slate-800 transition-colors"
        />
      </svg>
    </div>
  );
};
