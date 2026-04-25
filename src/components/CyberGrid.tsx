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
  dates: string[];
}

export const CyberGrid: React.FC<CyberGridProps> = ({ habit, onToggle, dates }) => {
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayDate = new Date().toISOString().split('T')[0];
  
  // Map our dates to progress entries
  const displayProgress = dates.map(date => {
    const entry = habit.progress.find(p => p.date === date);
    return entry || { date, completed: false };
  });
  
  return (
    <div className="grid grid-cols-7 gap-3 mt-4">
      {displayProgress.map((day, idx) => {
        const dateObj = new Date(day.date);
        const dayLabel = dayNames[dateObj.getDay()];
        const isToday = day.date === todayDate;
        const isDisabled = !isToday;
        
        return (
          <div key={day.date} className="flex flex-col items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-widest ${isToday ? 'text-violet-accent' : 'text-text-muted'}`}>
              {dayLabel}
            </span>
            <motion.button
              whileHover={isDisabled ? {} : { scale: 1.1 }}
              whileTap={isDisabled ? {} : { scale: 0.9 }}
              onClick={() => !isDisabled && onToggle(day.date)}
              className={`
                w-10 h-10 rounded-xl border transition-all duration-300 relative
                ${day.completed 
                  ? 'bg-violet-accent border-violet-accent neon-glow text-white' 
                  : (isToday ? 'bg-white/10 border-violet-accent/50 text-text' : 'bg-white/5 border-border text-text-muted')
                }
                ${isDisabled ? 'cursor-not-allowed opacity-40 grayscale-[0.5]' : 'cursor-pointer hover:border-violet-accent/30'}
                flex items-center justify-center overflow-hidden
              `}
              id={`day-${habit.id}-${day.date}`}
              title={isToday ? "Today: Toggle Habit" : `${day.date} (Locked)`}
            >
              {isToday && !day.completed && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 border-2 border-violet-accent rounded-xl pointer-events-none"
                />
              )}
              {day.completed ? <CheckCircle2 size={16} /> : <Circle size={16} className={isToday ? "opacity-40" : "opacity-20"} />}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};
