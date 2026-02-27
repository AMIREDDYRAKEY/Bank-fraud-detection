import React, { useState, useEffect } from 'react';
import { adminDataApi } from '../services/api';
import { 
  User, 
  MoreVertical, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Zap,
  CreditCard,
  History,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminDataApi.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to retrieve user registry');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, userId) => {
    try {
      if (action === 'unhold') await adminDataApi.unholdUser(userId);
      if (action === 'block') await adminDataApi.blockUser(userId);
      if (action === 'unblock') await adminDataApi.unblockUser(userId);
      
      toast.success(`User status updated: ${action.toUpperCase()}`);
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to process administrative action');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'HOLD': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'BLOCKED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Zap className="w-12 h-12 text-blue-500 animate-pulse" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">
            User <span className="text-blue-500">Management</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Administrative Registry Console</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input 
              type="text" 
              placeholder="Filter by Name/Account..." 
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User Profile</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Number</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Joined</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user, index) => (
              <tr key={user._id || index} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{user.email || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-gray-400 tracking-tighter">{user.account_number || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-white tabular-nums">
                    ${user.balance !== undefined ? user.balance.toLocaleString() : '0'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest border ${getStatusStyle(user.status)}`}>
                    {user.status || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                    className="p-2 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl glass-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase italic">{selectedUser.name}</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${getStatusStyle(selectedUser.status).split(' ')[1]}`}>
                      Status: {selectedUser.status}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors uppercase font-bold text-xs">Close</button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Balance</p>
                    <p className="text-lg font-black text-white tabular-nums">${selectedUser.balance.toLocaleString()}</p>
                  </div>
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Account Number</p>
                    <p className="text-sm font-mono text-blue-400">{selectedUser.account_number}</p>
                  </div>
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Verified</p>
                    <p className="text-sm font-bold text-green-400 uppercase tracking-widest">Yes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Administrative Controls</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.status === 'HOLD' && (
                      <>
                        <button 
                          onClick={() => handleAction('unhold', selectedUser._id)}
                          className="py-4 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/20 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                        >
                          Unhold Account
                        </button>
                        <button 
                          onClick={() => handleAction('block', selectedUser._id)}
                          className="py-4 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                        >
                          Block Permanently
                        </button>
                      </>
                    )}
                    {selectedUser.status === 'ACTIVE' && (
                      <button 
                        onClick={() => handleAction('block', selectedUser._id)}
                        className="col-span-2 py-4 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                      >
                        Suspend / Block Account
                      </button>
                    )}
                    {selectedUser.status === 'BLOCKED' && (
                      <button 
                        onClick={() => handleAction('unblock', selectedUser._id)}
                        className="col-span-2 py-4 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                      >
                        Unblock / Restore Access
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
