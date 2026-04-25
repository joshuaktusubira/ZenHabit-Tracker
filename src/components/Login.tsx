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
    const initializeGoogle = () => {
      // @ts-ignore
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
          { 
            theme: 'outline', 
            size: 'large', 
            width: 320,
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'left'
          }
        );
      }
    };

    // If script already loaded, initialize immediately
    // @ts-ignore
    if (window.google) {
      initializeGoogle();
    } else {
      // Fallback in case it's not ready yet
      const interval = setInterval(() => {
        // @ts-ignore
        if (window.google) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
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
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden transition-colors duration-300 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-accent/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-accent/15 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass p-10 md:p-16 max-w-xl w-full flex flex-col items-center text-center relative z-10 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
      >
        <motion.div 
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 bg-violet-accent rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(143,0,255,0.5)] mb-10 group cursor-default"
        >
          <BarChart3 size={48} className="text-white transition-transform duration-500 group-hover:scale-110" />
        </motion.div>

        <p className="text-violet-accent text-[10px] md:text-xs font-black tracking-[0.5em] uppercase mb-6 opacity-80">
          Visual Identity System
        </p>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4 text-text leading-none">
          ZenHabit
        </h1>
        
        <p className="text-text/50 mb-16 max-w-xs md:max-w-md text-sm md:text-base leading-relaxed">
          Elevate your daily routines with minimalist precision. Track, visualize, and master your habits in a high-fidelity workspace.
        </p>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-accent to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div 
            id="google-signin-btn" 
            className="relative h-[50px] transition-all duration-300"
          >
            {/* GIS button renders here */}
            {!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE') ? (
              <div className="text-red-400 text-xs px-8 py-3 border border-red-400/20 rounded-full bg-red-400/5">
                Missing CLIENT_ID in environment
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-accent/20" />
            ))}
          </div>
          <p className="text-[10px] text-text/20 uppercase tracking-[0.3em] font-black font-mono">
            SECURE_AUTH_LAYER // v1.0.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};
