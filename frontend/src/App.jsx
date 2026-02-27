import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RiskGauge from './components/RiskGauge';
import TransactionForm from './components/TransactionForm';
import ResultCard from './components/ResultCard';
import Charts from './components/Charts';
import TransactionsTable from './components/TransactionsTable';
import ReportModal from './components/ReportModal';
import FraudAlertModal from './components/FraudAlertModal';
import Login from './components/Login';
import Register from './components/Register';
import { authApi, bankApi } from './services/api';

import { 
  ShieldCheck, 
  ShieldAlert, 
  Settings as SettingsIcon, 
  Bell, 
  Activity, 
  Zap,
  TrendingUp,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [activeView, setActiveView] = useState('Dashboard');
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await authApi.getMe();
      setUser(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await bankApi.getHistory();
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchUserData(), fetchTransactions()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleSendMoney = async (formData) => {
    if (user?.status === 'HOLD') {
      toast.error('Account is on HOLD. Transactions restricted.');
      return;
    }

    setTxLoading(true);
    const toastId = toast.loading('Analyzing transaction risk...');

    try {
      const response = await bankApi.sendMoney(formData);
      const result = response.data;
      
      setPredictionResult(result);
      setRiskScore(result.risk_score * 100);
      
      if (result.status === 'SUCCESS') {
        toast.success(
          result.decision === 'OTP_VERIFICATION' 
            ? 'OTP Verified! Transaction Success.' 
            : 'Transaction Approved!', 
          { id: toastId }
        );
        fetchUserData(); // Refresh balance
        fetchTransactions(); // Refresh history
      } else if (result.status === 'BLOCKED') {
        toast.error('FRAUD DETECTED: Account placed on HOLD', { 
          id: toastId,
          duration: 6000
        });
        setAlertData(result);
        setIsAlertOpen(true);
        setUnreadAlerts(prev => prev + 1);
        fetchUserData(); // Refresh status to HOLD
        fetchTransactions();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Transaction failed', { id: toastId });
    } finally {
      setTxLoading(false);
    }
  };

  const openReport = (data) => {
    setSelectedReportData(data);
    setIsReportOpen(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      <Navbar isConnected={true} user={user} />
      <Sidebar 
        activeView={activeView} 
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'Alerts') setUnreadAlerts(0);
        }} 
        alertBadge={unreadAlerts}
      />

      <main className="pl-64 pt-[73px] min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* HOLD Banner */}
          {user?.status === 'HOLD' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-6"
            >
              <div className="bg-red-500 p-3 rounded-xl shadow-lg shadow-red-500/20">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-red-400 font-bold uppercase tracking-widest text-sm">Account on Hold</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Suspicious activity detected. All outgoing transactions have been restricted. 
                  Please contact bank support for verification.
                </p>
              </div>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all uppercase tracking-widest">
                Contact Support
              </button>
            </motion.div>
          )}

          {/* View Heading */}
          <motion.div 
            key={activeView}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                  {activeView === 'Dashboard' ? 'Live Banking' : activeView}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Secure Node: {user?.account_number}
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
                {activeView} <span className="text-blue-500">{activeView === 'Dashboard' ? 'Monitor' : ''}</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wallet Balance</p>
                <p className="text-xl font-mono font-bold text-blue-400">${user?.balance.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'Dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-3">
                      <RiskGauge score={riskScore} />
                    </div>
                    <div className="xl:col-span-4">
                      <TransactionForm 
                        onPredict={handleSendMoney} 
                        loading={txLoading} 
                        isBlocked={user?.status === 'HOLD'} 
                      />
                    </div>
                    <div className="xl:col-span-5">
                      <ResultCard result={predictionResult} onViewDetails={openReport} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">Session Analytics</h2>
                    </div>
                    <Charts transactions={transactions} />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">Recent Activity</h2>
                    </div>
                    <TransactionsTable transactions={transactions} onViewDetails={openReport} />
                  </div>
                </div>
              )}

              {activeView === 'Transactions' && (
                <div className="space-y-6">
                  <TransactionsTable transactions={transactions} onViewDetails={openReport} />
                </div>
              )}

              {activeView === 'Alerts' && (
                <div className="space-y-6">
                  {transactions.filter(t => t.decision !== 'APPROVE').map(alert => (
                    <div key={alert.id || alert._id} className="bg-dark-800/50 border border-red-500/20 rounded-2xl p-6 flex items-start gap-6">
                      <div className="bg-red-500/10 p-3 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-white uppercase tracking-wider">{alert.decision === 'BLOCK' ? 'HOLD' : alert.decision} ALERT</h4>
                            <p className="text-xs text-gray-400 mt-1">Transaction <span className="text-blue-400 font-mono">{alert.id || (alert._id && alert._id.slice(-6))}</span> exceeded safety thresholds.</p>
                            
                            {alert.explanation && alert.explanation.length > 0 && (
                              <div className="mt-3 space-y-1">
                                {alert.explanation.map((reason, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-[10px] text-red-400/80 font-medium">
                                    <div className="w-1 h-1 rounded-full bg-red-500/50" />
                                    {reason}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                              <button 
                                onClick={() => openReport(alert)}
                                className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
                              >
                                View Detailed Report
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-mono font-bold text-white">${alert.amount?.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{new Date(alert.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {transactions.filter(t => t.decision !== 'APPROVE').length === 0 && (
                    <div className="bg-dark-800/50 border border-gray-800 rounded-2xl p-12 text-center">
                      <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 font-medium">No security alerts detected.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        data={selectedReportData} 
      />

      <FraudAlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        data={alertData}
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
