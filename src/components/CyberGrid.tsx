/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Habit, DayProgress } from '../types';

export interface CyberGridProps {
  habit: Habit;
  onToggle: (date: string) => void;
}

export const CyberGrid: React.FC<CyberGridProps> = ({ habit, onToggle }) => {
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // We want to map the 7 days of progress to the grid
  // Habit.progress is already 7 days
  
  return (
    <div className="grid grid-cols-7 gap-3 mt-4">
      {habit.progress.map((day, idx) => {
        const dateObj = new Date(day.date);
        const dayLabel = dayNames[dateObj.getDay()];
        
        return (
          <div key={day.date} className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
              {dayLabel}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggle(day.date)}
              className={`
                w-10 h-10 rounded-xl border transition-all duration-300
                ${day.completed 
                  ? 'bg-violet-accent border-violet-accent neon-glow text-white' 
                  : 'bg-white/5 border-white/10 hover:border-white/30 text-transparent'
                }
                flex items-center justify-center cursor-pointer overflow-hidden
              `}
              id={`day-${habit.id}-${day.date}`}
            >
              {day.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};
