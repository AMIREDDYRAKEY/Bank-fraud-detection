import React, { useState, useEffect } from 'react';
import { adminDataApi } from '../services/api';
import { 
  ArrowUpRight, 
  MoreVertical, 
  Search, 
  Filter, 
  ShieldAlert, 
  Zap,
  CreditCard,
  History,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, FRAUD, HIGH_RISK

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await adminDataApi.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to sync global transaction stream');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'FRAUD') return t.decision === 'BLOCK';
    if (filter === 'HIGH_RISK') return t.risk_score > 0.5;
    return true;
  });

  const getBadgeStyle = (decision) => {
    switch (decision) {
      case 'APPROVE': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'OTP_VERIFICATION': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'BLOCK': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Zap className="w-12 h-12 text-blue-500 animate-pulse" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">
            Transaction <span className="text-blue-500">Monitor</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Global Network Ledger Activity</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold uppercase tracking-widest"
          >
            <option value="ALL">All Traffic</option>
            <option value="FRAUD">Blocked Only</option>
            <option value="HIGH_RISK">High Risk (Greater than 50%)</option>
          </select>
          <button onClick={fetchTransactions} className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction Node</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Receiver Node</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Risk Analysis</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Verdict</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTransactions.map((tx, index) => (
              <tr key={tx._id || index} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-400 group-hover:text-blue-300">
                      #{tx._id ? tx._id.slice(-6).toUpperCase() : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-gray-400">{tx.receiver_account || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-white tabular-nums">
                    ${tx.amount !== undefined ? tx.amount.toLocaleString() : '0'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${tx.risk_score > 0.7 ? 'bg-red-500' : tx.risk_score > 0.3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${(tx.risk_score || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-500">
                      {tx.risk_score !== undefined ? (tx.risk_score * 100).toFixed(0) : '0'}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[9px] font-black tracking-widest border ${getBadgeStyle(tx.decision)}`}>
                    {tx.decision === 'BLOCK' ? 'HOLD' : (tx.decision || 'N/A')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="p-20 text-center opacity-20">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">No matching ledger entries</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
