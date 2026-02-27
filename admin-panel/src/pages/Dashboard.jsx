import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  ArrowLeftRight, 
  TrendingUp, 
  DollarSign, 
  Zap,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';
import { adminDataApi } from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card p-6 relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 p-8 opacity-5 ${color}`}>
      <Icon className="w-24 h-24" />
    </div>
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {trend > 0 ? (
        <div className="flex items-center gap-1 text-green-400">
          <ArrowUpRight className="w-3 h-3" />
          <span className="text-[10px] font-bold">+{trend}%</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-red-400">
          <ArrowDownRight className="w-3 h-3" />
          <span className="text-[10px] font-bold">{trend}%</span>
        </div>
      )}
      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">vs last month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminDataApi.getStats();
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to synchronize network statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

  // Mock graph data based on stats if available
  const areaData = [
    { name: '00:00', val: 400 }, { name: '04:00', val: 300 },
    { name: '08:00', val: 900 }, { name: '12:00', val: 1200 },
    { name: '16:00', val: 1500 }, { name: '20:00', val: 800 },
    { name: '23:59', val: 600 }
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">
            Network <span className="text-blue-500">Overview</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Global Fraud Monitoring Cluster</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Last Updated</p>
            <p className="text-xs font-mono text-gray-400">Just Now</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.total_users || 0} icon={Users} trend={12} color="text-blue-400" />
        <StatCard title="Active Accounts" value={stats?.active_accounts || 0} icon={ShieldCheck} trend={8} color="text-green-400" />
        <StatCard title="Accounts on HOLD" value={stats?.hold_accounts || 0} icon={Clock} trend={-5} color="text-yellow-400" />
        <StatCard title="Blocked Accounts" value={stats?.blocked_accounts || 0} icon={ShieldAlert} trend={2} color="text-red-400" />
        <StatCard title="Total Transactions" value={stats?.total_transactions || 0} icon={ArrowLeftRight} trend={24} color="text-indigo-400" />
        <StatCard title="Fraud Detected" value={stats?.fraud_transactions || 0} icon={Zap} trend={15} color="text-red-500" />
        <StatCard title="Money Transferred" value={`$${stats?.total_money !== undefined ? stats.total_money.toLocaleString() : '0'}`} icon={DollarSign} trend={18} color="text-emerald-400" />
        <StatCard title="Detection Rate" value={`${stats?.fraud_rate || 0}%`} icon={TrendingUp} trend={4} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-widest">Traffic Analysis (24h)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Volume</span>
              </div>
            </div>
          </div>
          <div className="w-full h-full pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 h-[450px]">
          <h3 className="text-sm font-bold text-gray-100 uppercase tracking-widest mb-8 text-center">Account Distribution</h3>
          <div className="w-full h-full pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: stats.active_accounts },
                    { name: 'Hold', value: stats.hold_accounts },
                    { name: 'Blocked', value: stats.blocked_accounts }
                  ]}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
