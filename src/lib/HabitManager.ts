/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Habit, DayProgress } from '../types';

const STORAGE_KEY = 'zenhabit_data';

export class HabitManager {
  private static instance: HabitManager;
  private habits: Habit[] = [];
  private currentUserId: string | null = null;

  private constructor() {}

  public static getInstance(): HabitManager {
    if (!HabitManager.instance) {
      HabitManager.instance = new HabitManager();
    }
    return HabitManager.instance;
  }

  public setUser(userId: string) {
    this.currentUserId = userId;
    this.load();
  }

  private getStorageKey(): string {
    return this.currentUserId ? `habit_data_${this.currentUserId}` : 'zenhabit_data';
  }

  private load() {
    if (!this.currentUserId) return;
    const data = localStorage.getItem(this.getStorageKey());
    if (data) {
      try {
        this.habits = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse habits', e);
        this.habits = [];
      }
    } else {
      this.habits = [];
    }
  }

  private save() {
    if (!this.currentUserId) return;
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.habits));
  }

  public getHabits(): Habit[] {
    if (!this.currentUserId) return [];
    return [...this.habits];
  }

  public addHabit(name: string): Habit | null {
    if (!this.currentUserId) return null;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      progress: this.generateInitialProgress(),
      streak: 0,
      targetGoal: 7 // Default goal
    };
    this.habits.push(newHabit);
    this.save();
    return newHabit;
  }

  public updateHabitGoal(habitId: string, targetGoal: number): Habit | null {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return null;
    habit.targetGoal = targetGoal;
    this.save();
    return { ...habit };
  }

  public toggleDay(habitId: string, date: string): Habit | null {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return null;

    const day = habit.progress.find(d => d.date === date);
    if (day) {
      day.completed = !day.completed;
      habit.streak = this.calculateStreak(habit);
      this.save();
      return { ...habit };
    }
    return null;
  }

  public deleteHabit(habitId: string) {
    this.habits = this.habits.filter(h => h.id !== habitId);
    this.save();
  }

  private generateInitialProgress(): DayProgress[] {
    const progress: DayProgress[] = [];
    const today = new Date();
    // 8 weeks = 56 days
    for (let i = 55; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      progress.push({
        date: d.toISOString().split('T')[0],
        completed: false
      });
    }
    return progress;
  }

  private calculateStreak(habit: Habit): number {
    let streak = 0;
    // Simple logic: count consecutive completed days starting from the "latest" day back
    const sortedProgress = [...habit.progress].sort((a, b) => b.date.localeCompare(a.date));
    
    for (const day of sortedProgress) {
      if (day.completed) {
        streak++;
      } else {
        // Only break streak if we are past the current day? 
        // For simplicity, we just count total consecutive currently visible in the grid
        break;
      }
    }
    return streak;
  }
}
