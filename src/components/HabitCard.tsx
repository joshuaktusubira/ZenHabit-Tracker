/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Flame, ChevronUp, ChevronDown } from 'lucide-react';
import { Habit } from '../types';
import { CyberGrid } from './CyberGrid';
import { Heatmap } from './Heatmap';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  onUpdateGoal: (habitId: string, newGoal: number) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete, onUpdateGoal }) => {
  const isGoalMet = habit.streak >= habit.targetGoal;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        borderColor: isGoalMet ? 'rgba(143, 0, 255, 0.4)' : 'var(--border-color)'
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card w-full relative group ${isGoalMet ? 'shadow-[0_0_30px_rgba(143,0,255,0.15)]' : ''}`}
      id={`habit-card-${habit.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-text leading-tight uppercase italic">
            {habit.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <motion.div
              key={habit.streak}
              animate={{ 
                scale: isGoalMet ? [1, 1.1, 1] : 1,
                color: isGoalMet ? '#8F00FF' : (habit.streak > 0 ? 'var(--text)' : 'var(--text-muted)')
              }}
              className="flex items-center gap-1"
            >
              <Flame size={14} className={habit.streak > 0 ? "text-violet-accent" : "text-text-muted"} />
              <span className={`text-[10px] font-mono font-bold tracking-wider ${habit.streak > 0 ? "text-text" : "text-text-muted"}`}>
                {habit.streak} / {habit.targetGoal} DAY STREAK
              </span>
            </motion.div>
            
            <div className="flex items-center ml-1 bg-text-muted/10 rounded-md px-1 border border-border">
              <button 
                onClick={() => onUpdateGoal(habit.id, Math.max(1, habit.targetGoal - 1))}
                className="p-0.5 hover:text-violet-accent transition-colors text-text-muted"
                title="Decrease Goal"
              >
                <ChevronDown size={14} />
              </button>
              <button 
                onClick={() => onUpdateGoal(habit.id, Math.min(365, habit.targetGoal + 1))}
                className="p-0.5 hover:text-violet-accent transition-colors text-text-muted"
                title="Increase Goal"
              >
                <ChevronUp size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 rounded-xl hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
          id={`delete-${habit.id}`}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <CyberGrid habit={habit} onToggle={(date) => onToggle(habit.id, date)} />
      
      <Heatmap progress={habit.progress} />
      
      {isGoalMet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-violet-accent text-white text-[10px] font-black px-2 py-0.5 rounded shadow-[0_0_10px_#8F00FF] z-10 italic uppercase"
        >
          Goal Met
        </motion.div>
      )}
    </motion.div>
  );
};
