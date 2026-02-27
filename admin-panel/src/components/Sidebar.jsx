import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  ShieldAlert, 
  Settings, 
  LogOut,
  Shield,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
    { icon: ShieldAlert, label: 'Fraud Logs', path: '/alerts' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 glass-dark border-r border-white/5 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tighter italic">
              FraudShield <span className="text-blue-500">AI</span>
            </h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link group ${isActive ? 'active' : ''}`}
          >
            <item.icon className="w-5 h-5 transition-colors group-hover:text-blue-400" />
            <span className="font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-[11px] font-bold uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
