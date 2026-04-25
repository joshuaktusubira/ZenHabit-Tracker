/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, LogIn } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // @ts-ignore - google is defined globally by the GSI script
    if (window.google) {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: 'popup',
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '280px' }
      );
    }
  }, [GOOGLE_CLIENT_ID]);

  // @ts-ignore
  const handleCredentialResponse = (response) => {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user: User = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-accent/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-accent/10 blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 max-w-md w-full flex flex-col items-center text-center relative z-10"
      >
        <div className="w-20 h-20 bg-violet-accent rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(143,0,255,0.4)] mb-8">
          <BarChart3 size={40} className="text-white" />
        </div>

        <p className="text-violet-accent text-xs font-bold tracking-[0.3em] uppercase mb-4">
          Visual Identity System
        </p>
        
        <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2 text-text">
          ZenHabit
        </h1>
        
        <p className="text-text/40 mb-12 max-w-[280px]">
          Elevate your daily routines with minimalist precision.
        </p>

        <div id="google-signin-btn" className="relative group">
          {/* Custom fallback/overlay to match aesthetic if script fails to load or button is hidden */}
          {!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE') ? (
            <div className="text-red-400 text-xs px-4 py-2 border border-red-400/20 rounded-lg">
              Missing CLIENT_ID in environment
            </div>
          ) : null}
        </div>

        <div className="mt-12 text-[10px] text-white/20 uppercase tracking-widest font-mono">
          SECURE_AUTH_LAYER // GIS_GIS
        </div>
      </motion.div>
    </div>
  );
};
