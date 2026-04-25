/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BarChart2, Flame, Calendar, Target } from 'lucide-react';
import { DayProgress, Habit } from '../types';
import { Heatmap } from './Heatmap';

interface StatisticsViewProps {
  habits: Habit[];
  aggregateProgress: DayProgress[];
  globalStreak: number;
  onBack: () => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ habits, aggregateProgress, globalStreak, onBack }) => {
  const totalCompletions = habits.reduce((acc, h) => acc + h.progress.filter(p => p.completed).length, 0);
  const activeHabits = habits.length;
  const averageStreak = habits.length > 0 ? habits.reduce((acc, h) => acc + h.streak, 0) / habits.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/5 border border-border hover:bg-white/10 transition-all text-text-muted hover:text-text group"
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none">
            Deep Analysis
          </h2>
          <p className="text-text-muted text-xs font-mono uppercase tracking-widest mt-1">
            System_Data :: Visual_Telemetry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card flex items-center gap-4 p-6">
          <div className="w-12 h-12 bg-violet-accent/20 rounded-2xl flex items-center justify-center text-violet-accent">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Streak</p>
            <p className="text-2xl font-black text-text">{globalStreak} DAYS</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 p-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
            <Target size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Habits</p>
            <p className="text-2xl font-black text-text">{activeHabits}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 p-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Rituals</p>
            <p className="text-2xl font-black text-text">{totalCompletions}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 p-6">
          <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Avg. Velocity</p>
            <p className="text-2xl font-black text-text">{averageStreak.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="glass-card mb-12 overflow-hidden">
        <div className="p-8 border-b border-border bg-white/[0.02]">
          <h3 className="text-xl font-bold text-text tracking-tight uppercase italic">
            Aggregate Consistency Heatmap
          </h3>
          <p className="text-text-muted text-sm mt-1">
            Visualizing total system engagement over the last 24 weeks.
          </p>
        </div>
        <div className="p-8 pb-12">
          <Heatmap 
            progress={aggregateProgress} 
            showLegend 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-text tracking-tight uppercase italic mb-6">
              Individual Reliability
            </h3>
            <div className="space-y-4">
              {habits.map(h => {
                const completions = h.progress.filter(p => p.completed).length;
                const rate = (completions / h.progress.length) * 100;
                return (
                  <div key={h.id} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-text uppercase tracking-wider">{h.name}</span>
                        <span className="text-xs font-mono text-text-muted">{rate.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-text-muted/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-accent transition-all duration-1000" 
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
         </div>

         <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-violet-accent/10 rounded-full flex items-center justify-center mb-4">
               <Calendar size={32} className="text-violet-accent" />
            </div>
            <h3 className="text-lg font-bold text-text tracking-tight uppercase italic">
               System Insight
            </h3>
            <p className="text-text-muted text-sm mt-2 max-w-xs transition-opacity duration-300">
               {globalStreak > 0 
                ? `You've maintained consistency for ${globalStreak} days straight. The system is operating at peak efficiency.`
                : "Awaiting activation. Complete any habit today to initiate a new global streak."
               }
            </p>
         </div>
      </div>
    </motion.div>
  );
};
