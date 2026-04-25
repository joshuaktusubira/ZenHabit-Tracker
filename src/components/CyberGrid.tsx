/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Habit, DayProgress } from '../types';

export interface CyberGridProps {
  habit: Habit;
  onToggle: (date: string) => void;
}

export const CyberGrid: React.FC<CyberGridProps> = ({ habit, onToggle }) => {
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // We want to map the 7 days of progress to the grid
  // Habit.progress is already 7 days
  const displayProgress = habit.progress.slice(-7);
  
  return (
    <div className="grid grid-cols-7 gap-3 mt-4">
      {displayProgress.map((day, idx) => {
        const dateObj = new Date(day.date);
        const dayLabel = dayNames[dateObj.getDay()];
        
        return (
          <div key={day.date} className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">
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
                  : 'bg-white/5 border-border text-text-muted hover:border-violet-accent/30'
                }
                flex items-center justify-center cursor-pointer overflow-hidden
              `}
              id={`day-${habit.id}-${day.date}`}
              title={day.date}
            >
              {day.completed ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-20" />}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};
