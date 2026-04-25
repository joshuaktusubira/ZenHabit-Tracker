/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { HabitManager } from './lib/HabitManager';
import { Habit, User, Theme } from './types';
import { HabitCard } from './components/HabitCard';
import { Login } from './components/Login';
import { SettingsDropdown } from './components/SettingsDropdown';
import { StatisticsView } from './components/StatisticsView';
import { Flame, Calendar, Plus, BarChart3, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [manager] = useState(() => HabitManager.getInstance());
  const [view, setView] = useState<'dashboard' | 'stats'>('dashboard');
  
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('zen_theme') as Theme) || 'system';
  });

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('zen_theme', theme);
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.remove('light');
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('zen_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      manager.setUser(parsedUser.id);
      setHabits(manager.getHabits());
    }
  }, [manager]);

  const handleLogin = (newUser: User) => {
    localStorage.setItem('zen_user', JSON.stringify(newUser));
    setUser(newUser);
    manager.setUser(newUser.id);
    setHabits(manager.getHabits());
    
    // Show welcome toast
    setToast(`Welcome back, ${newUser.name.split(' ')[0]}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('zen_user');
    setUser(null);
    setHabits([]);
  };

  const handleAddHabit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = newHabitName.trim();
    if (!trimmedName) return;
    
    const habit = manager.addHabit(trimmedName);
    if (habit) {
      setHabits(manager.getHabits());
      setNewHabitName('');
    }
  };

  const handleToggleDay = useCallback((habitId: string, date: string) => {
    const updatedHabit = manager.toggleDay(habitId, date);
    if (updatedHabit) {
      setHabits(manager.getHabits());
      
      // Trigger confetti if a target goal is achieved
      if (updatedHabit.streak === updatedHabit.targetGoal) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8F00FF', '#FFFFFF', '#4D008C']
        });
      }
    }
  }, [manager]);

  const handleDeleteHabit = useCallback((habitId: string) => {
    manager.deleteHabit(habitId);
    setHabits(manager.getHabits());
  }, [manager]);

  const handleUpdateGoal = useCallback((habitId: string, newGoal: number) => {
    manager.updateHabitGoal(habitId, newGoal);
    setHabits(manager.getHabits());
  }, [manager]);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-violet-accent/30 p-4 md:p-8 font-sans transition-colors duration-300">
      {/* Welcome Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] glass px-6 py-4 flex items-center gap-3 border-violet-accent/30 shadow-[0_0_30px_rgba(143,0,255,0.2)]"
          >
            <div className="w-8 h-8 bg-violet-accent rounded-full flex items-center justify-center text-white">
              <CheckCircle2 size={16} />
            </div>
            <span className="font-bold tracking-tight whitespace-nowrap text-text">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-accent/15 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full overflow-hidden">
        {/* Navigation / Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-violet-accent rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(143,0,255,0.4)]">
              <BarChart3 size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
              ZenHabit
            </h1>
          </div>
          
          <SettingsDropdown 
            user={user} 
            theme={theme} 
            onThemeChange={setTheme} 
            onLogout={handleLogout} 
            onViewStats={() => setView('stats')}
          />
        </header>

        <main className="w-full">
          <AnimatePresence mode="wait">
            {view === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                {/* Dashboard Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="px-3 py-1 rounded-full bg-violet-accent/10 border border-violet-accent/20 text-violet-accent text-[10px] font-bold tracking-[0.2em] uppercase">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                        <Flame size={12} />
                        GLOBAL STREAK: {manager.getGlobalStreak()}
                      </div>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
                      System <br />
                      <span className="text-text/40 italic">Overview.</span>
                    </h2>
                  </div>

                  {habits.length === 0 && (
                    <form onSubmit={handleAddHabit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="Track a new ritual..."
                        className="bg-white/5 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-accent/50 focus:bg-white/10 transition-all w-full lg:w-80 text-text font-medium placeholder:text-text/20"
                        id="habit-input-empty"
                      />
                      <button
                        type="submit"
                        className="bg-violet-accent hover:bg-violet-accent/80 text-white font-bold p-4 rounded-2xl shadow-[0_10px_20px_rgba(143,0,255,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2 px-8"
                        id="add-habit-btn-empty"
                      >
                        <Plus size={24} />
                        <span className="lg:hidden">ADD HABIT</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Habit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  <AnimatePresence mode="popLayout">
                    {habits.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        onToggle={handleToggleDay}
                        onDelete={handleDeleteHabit}
                        onUpdateGoal={handleUpdateGoal}
                      />
                    ))}
                  </AnimatePresence>

                  {habits.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full py-32 text-center"
                    >
                      <div className="glass-card inline-block p-16 max-w-sm border-dashed">
                        <p className="text-text/30 text-xl font-medium tracking-tight">
                          No rituals active. <br />
                          <span className="text-violet-accent/50">Begin your journey above.</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {habits.length > 0 && (
                  <div className="flex justify-center mt-12 mb-24">
                    <form onSubmit={handleAddHabit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl px-4">
                      <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="Add another ritual..."
                        className="bg-white/5 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-accent/50 focus:bg-white/10 transition-all flex-1 text-text font-medium placeholder:text-text/20"
                        id="habit-input-filled"
                      />
                      <button
                        type="submit"
                        className="bg-violet-accent hover:bg-violet-accent/80 text-white font-bold p-4 rounded-2xl shadow-[0_10px_20px_rgba(143,0,255,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2 px-10"
                        id="add-habit-btn-filled"
                      >
                        <Plus size={24} />
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            ) : (
              <StatisticsView
                key="stats"
                habits={habits}
                aggregateProgress={manager.getAggregateProgress()}
                globalStreak={manager.getGlobalStreak()}
                onBack={() => setView('dashboard')}
              />
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-40 pb-12 border-t border-border pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-text/20 text-xs font-mono">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
             <p className="uppercase tracking-widest">System Status :: Optimal</p>
          </div>
          <p className="uppercase tracking-[0.2em] font-bold text-text/40">ZenHabit v1.0.0 // Hackathon Build</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-violet-accent transition-colors underline decoration-text/10 underline-offset-8">PRIVACY</a>
            <a href="#" className="hover:text-violet-accent transition-colors underline decoration-text/10 underline-offset-8">LEGAL</a>
            <a href="#" className="hover:text-violet-accent transition-colors underline decoration-text/10 underline-offset-8">SOURCE</a>
          </div>
        </footer>
      </div>
    </div>
  );
}