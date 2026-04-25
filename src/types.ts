/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface DayProgress {
  date: string; // ISO string for the day
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  createdAt: number;
  // We track the last 7 days for the "Cyber-Grid"
  progress: DayProgress[];
  streak: number;
  targetGoal: number;
}
