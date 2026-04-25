/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, LogOut, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { Theme, User } from '../types';

interface SettingsDropdownProps {
  user: User;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLogout: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ user, theme, onThemeChange, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: { id: Theme; icon: any; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 p-1 pl-3 rounded-full border transition-all duration-300
          ${isOpen ? 'bg-white/10 border-violet-accent/50 shadow-[0_0_20px_rgba(143,0,255,0.1)]' : 'bg-white/5 border-border hover:bg-white/10'}
        `}
        id="settings-trigger"
      >
        <span className="text-xs font-mono text-text-muted hidden sm:inline uppercase tracking-widest leading-none">
          {user.name.split(' ')[0]}
        </span>
        <img 
          src={user.picture} 
          alt={user.name} 
          className="w-8 h-8 rounded-full border border-border" 
          referrerPolicy="no-referrer" 
        />
        <ChevronDown size={14} className={`text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-64 glass-card p-4 z-50 border-violet-accent/20"
          >
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-3 px-1">
                Appearance
              </p>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onThemeChange(opt.id)}
                    className={`
                      flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200
                      ${theme === opt.id 
                        ? 'bg-violet-accent border-violet-accent text-white shadow-lg shadow-violet-accent/20' 
                        : 'bg-white/5 border-border text-text-muted hover:border-white/30 hover:text-text'
                      }
                    `}
                  >
                    <opt.icon size={16} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 text-text/60 hover:text-red-400 font-bold transition-all group"
              >
                <span className="text-xs uppercase tracking-widest">Sign Out</span>
                <LogOut size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-4 text-[8px] text-center text-text-muted font-mono uppercase tracking-[0.3em]">
              Auth_layer :: Session_active
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
