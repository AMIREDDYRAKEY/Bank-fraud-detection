import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, X, Phone, Shield } from 'lucide-react';

const FraudAlertModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-red-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-dark-900 border-2 border-red-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]"
        >
          {/* Header */}
          <div className="bg-red-500 p-8 flex flex-col items-center text-center text-white relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-white/20 p-4 rounded-3xl mb-4 backdrop-blur-md">
              <ShieldAlert className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Account Freeze</h2>
            <p className="text-red-100 text-sm font-medium mt-2">Critical Security Intervention</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-start gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Suspicious Activity Detected</h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Our AI Neural Core has flagged transaction <span className="text-red-400 font-mono font-bold">#{data.id?.slice(-6)}</span> as high-risk ({(data.risk_score * 100).toFixed(0)}% fraud probability).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">What happens now?</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Outgoing transfers are temporarily disabled
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Your digital wallet has been locked
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Fraud investigation report has been generated
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                className="w-full py-4 bg-white text-dark-900 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3"
              >
                <Phone className="w-4 h-4" />
                Contact Security Desk
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white/5 text-gray-400 font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all border border-white/10"
              >
                Dismiss for Now
              </button>
            </div>
          </div>

          <div className="p-4 bg-red-500/5 border-t border-red-500/10 text-center">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              FraudShield Secure Banking System
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FraudAlertModal;
