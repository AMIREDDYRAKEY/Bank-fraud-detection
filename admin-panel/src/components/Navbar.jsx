import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Clock, Activity } from 'lucide-react';

const Navbar = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-[73px] fixed top-0 right-0 left-64 glass-dark border-b border-white/5 px-8 flex items-center justify-between z-40">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Global Node..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-green-500/5 border border-green-500/10">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Network Operational</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-mono text-gray-400">{time}</span>
        </div>

        <div className="h-8 w-px bg-white/5 mx-2" />

        <div className="flex items-center gap-4">
          <button className="relative p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617]" />
          </button>
          
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="text-xs font-bold text-white">System Admin</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Root Access</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
