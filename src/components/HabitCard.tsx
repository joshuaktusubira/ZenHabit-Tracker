/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Flame, ChevronUp, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { Habit } from '../types';
import { CyberGrid } from './CyberGrid';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  onUpdateGoal: (habitId: string, newGoal: number) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete, onUpdateGoal }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  
  const isGoalMet = habit.streak >= habit.targetGoal;
  const todayDate = new Date().toISOString().split('T')[0];
  const todayProgress = habit.progress.find(p => p.date === todayDate);
  const isCompletedToday = todayProgress?.completed || false;

  // Calculate dates for the visible week
  // We'll define a week as starting from Sunday
  const weekDates = useMemo(() => {
    const today = new Date();
    // Move to the current week's Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }, [weekOffset]);

  // Determine boundaries
  const createdDate = new Date(habit.createdAt);
  const startOfCreatedWeek = new Date(createdDate);
  startOfCreatedWeek.setDate(createdDate.getDate() - createdDate.getDay());
  startOfCreatedWeek.setHours(0, 0, 0, 0);

  const startOfCurrentWeekView = new Date(weekDates[0]);
  startOfCurrentWeekView.setHours(0, 0, 0, 0);

  const canScrollBack = startOfCurrentWeekView > startOfCreatedWeek;
  const canScrollForward = weekOffset < 2;

  // Week number calculation (1-based relative to creation)
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  const currentWeekNumber = Math.floor((startOfCurrentWeekView.getTime() - startOfCreatedWeek.getTime()) / msInWeek) + 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        borderColor: isGoalMet ? 'rgba(143, 0, 255, 0.4)' : 'var(--border-color)',
        backgroundColor: isCompletedToday ? 'rgba(143, 0, 255, 0.03)' : 'var(--glass-bg)'
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card w-full relative group ${isGoalMet ? 'shadow-[0_0_30px_rgba(143,0,255,0.15)]' : ''}`}
      id={`habit-card-${habit.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold tracking-tight text-text leading-tight uppercase italic transition-all duration-300 ${isCompletedToday ? 'opacity-50 line-through' : 'opacity-100'}`}>
            {habit.name}
          </h3>
          <p className="text-[10px] font-bold text-text uppercase tracking-[0.2em] mt-0.5">
            Week {currentWeekNumber} {weekOffset === 0 ? "(Current)" : weekOffset > 0 ? "(Future)" : "(Past)"}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <motion.div
              key={habit.streak}
              animate={{ 
                scale: isGoalMet ? [1, 1.1, 1] : 1,
                color: isGoalMet ? '#8F00FF' : (habit.streak > 0 ? 'var(--text)' : 'var(--text-muted)')
              }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-1">
                <Flame size={14} className={habit.streak > 0 ? "text-violet-accent" : "text-text-muted"} />
                <span className={`text-[10px] font-mono font-bold tracking-wider ${habit.streak > 0 ? "text-text" : "text-text-muted"}`}>
                  {habit.streak} / {habit.targetGoal} STREAK
                </span>
              </div>

              <div className="flex flex-col -space-y-1">
                <button 
                  onClick={() => setWeekOffset(prev => Math.min(prev + 1, 2))}
                  disabled={!canScrollForward}
                  className={`p-0.5 transition-colors ${canScrollForward ? 'text-text-muted hover:text-violet-accent' : 'opacity-10 cursor-not-allowed'}`}
                  title="Next Week"
                >
                  <ChevronUp size={12} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => setWeekOffset(prev => Math.max(prev - 1, -100))}
                  disabled={!canScrollBack}
                  className={`p-0.5 transition-colors ${canScrollBack ? 'text-text-muted hover:text-violet-accent' : 'opacity-10 cursor-not-allowed'}`}
                  title="Previous Week"
                >
                  <ChevronDown size={12} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
            
            {/* Goal controls hidden by default, shown on hover/focus if needed, but let's keep them small and out of the way */}
            <div className="flex items-center ml-auto bg-text-muted/5 rounded-full px-2 py-0.5 border border-border/10">
               <button 
                onClick={() => onUpdateGoal(habit.id, Math.max(1, habit.targetGoal - 1))}
                className="p-0.5 hover:text-violet-accent transition-colors text-text-muted/30"
                title="Decrease Target"
              >
                <ChevronDown size={10} />
              </button>
              <span className="text-[8px] font-black text-text-muted/20 px-1">GOAL</span>
              <button 
                onClick={() => onUpdateGoal(habit.id, Math.min(365, habit.targetGoal + 1))}
                className="p-0.5 hover:text-violet-accent transition-colors text-text-muted/30"
                title="Increase Target"
              >
                <ChevronUp size={10} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(habit.id, todayDate)}
            className={`
              p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center
              ${isCompletedToday 
                ? 'bg-violet-accent border-violet-accent text-white shadow-[0_0_15px_rgba(143,0,255,0.4)]' 
                : 'bg-white/5 border-border text-text-muted hover:border-violet-accent/50 hover:text-violet-accent'
              }
            `}
            id={`toggle-today-${habit.id}`}
            title={isCompletedToday ? "Mark as Incomplete" : "Mark as Complete"}
          >
            {isCompletedToday ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </motion.button>

          <button
            onClick={() => onDelete(habit.id)}
            className="p-2.5 rounded-xl hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all border border-transparent hover:border-red-500/10"
            id={`delete-${habit.id}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={weekOffset}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            <CyberGrid 
              habit={habit} 
              onToggle={(date) => onToggle(habit.id, date)} 
              dates={weekDates} 
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
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
