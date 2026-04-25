/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { DayProgress } from '../types';

interface HeatmapProps {
  progress: DayProgress[];
  label?: string;
  showLegend?: boolean;
}

export const Heatmap: React.FC<HeatmapProps> = ({ progress, label, showLegend = true }) => {
  // progress is segmented into weeks
  const weeks = [];
  // Ensure we group by full weeks starting from the first day in progress
  for (let i = 0; i < progress.length; i += 7) {
    weeks.push(progress.slice(i, i + 7));
  }

  return (
    <div className="mt-6 w-full">
      {label && (
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-3 px-1">
          {label}
        </h4>
      )}
      <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1.5 shrink-0">
            {week.map((day) => (
              <div
                key={day.date}
                className={`
                  w-3 h-3 md:w-3.5 md:h-3.5 rounded-[2px] transition-all duration-300 relative group/tile
                  ${day.completed 
                    ? 'bg-violet-accent shadow-[0_0_8px_rgba(143,0,255,0.4)]' 
                    : 'bg-text-muted/10 border border-border'
                  }
                `}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg border border-border text-text text-[9px] rounded opacity-0 group-hover/tile:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-2xl font-mono">
                   {day.date}: <span className={day.completed ? "text-violet-accent font-bold" : "text-text-muted"}>{day.completed ? 'COMPLETED' : 'SKIPPED'}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {showLegend && (
        <div className="flex justify-between items-center mt-1 px-1">
          <span className="text-[8px] text-text-muted font-mono tracking-widest uppercase">HISTORY_START</span>
          <span className="text-[8px] text-text-muted font-mono tracking-widest uppercase">PRESENT_MOMENT</span>
        </div>
      )}
    </div>
  );
};
