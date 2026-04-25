/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { DayProgress } from '../types';

interface HeatmapProps {
  progress: DayProgress[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ progress }) => {
  // progress is 56 days (8 weeks)
  // We want to show them in a grid of 7 rows (days) by 8 columns (weeks)
  // or 8 columns by 7 rows. GitHub style is usually weeks as columns.
  
  const weeks = [];
  for (let i = 0; i < progress.length; i += 7) {
    weeks.push(progress.slice(i, i + 7));
  }

  return (
    <div className="mt-6">
      <h4 className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-3">
        Consistency Heatmap (8 Weeks)
      </h4>
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1.5">
            {week.map((day) => (
              <div
                key={day.date}
                className={`
                  w-2.5 h-2.5 rounded-[2px] transition-all duration-300 relative group/tile
                  ${day.completed 
                    ? 'bg-violet-accent shadow-[0_0_8px_rgba(143,0,255,0.4)]' 
                    : 'bg-text-muted/10 border border-border'
                  }
                `}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-charcoal text-white text-[8px] rounded opacity-0 group-hover/tile:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                   {day.date}: {day.completed ? 'Completed' : 'Skipped'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-[8px] text-text-muted font-mono tracking-tighter">8 WEEKS AGO</span>
        <span className="text-[8px] text-text-muted font-mono tracking-tighter">PRESENT</span>
      </div>
    </div>
  );
};
