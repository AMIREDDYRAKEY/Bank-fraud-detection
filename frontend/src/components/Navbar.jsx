import React, { useState, useEffect } from 'react';
import { Shield, Bell, User, Wifi, WifiOff, LogOut, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isConnected, user }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent block leading-tight">
            FraudShield AI
          </span>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block">Banking Core</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* API Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          {isConnected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Secure Connection</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Offline</span>
            </>
          )}
        </div>

        {/* Balance Display */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <Wallet className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-mono font-bold text-blue-100">
            ${user?.balance?.toLocaleString()}
          </span>
        </div>

        <div className="text-sm text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
          {time}
        </div>

        <div className="flex items-center gap-4 relative">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-dark-900" />
          </button>
          
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
              <p className={`text-[10px] font-bold uppercase tracking-tighter ${user?.status === 'HOLD' ? 'text-red-400' : 'text-green-400'}`}>
                {user?.status}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-all">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-4 w-48 glass-dark border border-white/10 rounded-2xl p-2 shadow-2xl"
              >
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
