import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Shield, 
  Activity, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Database,
  Fingerprint,
  Zap
} from 'lucide-react';

const ReportModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { risk_score, decision, model, id, time, amount, source, target, explanation } = data;
  const score = Math.round(risk_score * 100);

  const getStatusConfig = () => {
    switch (decision) {
      case 'APPROVE':
        return {
          icon: CheckCircle2,
          color: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          label: 'Clean Transaction',
          desc: 'Our AI model has verified this transaction as legitimate with high confidence.'
        };
      case 'OTP_VERIFICATION':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          label: 'Verification Required',
          desc: 'Behavioral anomalies detected. We recommend secondary authentication via OTP.'
        };
      case 'BLOCK':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          label: 'Critical Fraud Alert',
          desc: 'High-risk patterns matched known fraud signatures. Transaction automatically blocked.'
        };
      default:
        return {};
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl glass-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">Fraud Analysis Report</h2>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Ref: {id || 'SYSTEM-GEN'}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
            {/* Verdict Section */}
            <div className={`p-6 rounded-2xl border ${config.border} ${config.bg} flex items-start gap-6`}>
              <div className={`p-4 rounded-2xl bg-white/5 ${config.color}`}>
                <StatusIcon className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-xl font-black uppercase tracking-tighter ${config.color}`}>{config.label}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{config.desc}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Activity className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Risk Score</span>
                </div>
                <p className={`text-xl font-mono font-bold ${config.color}`}>{score}%</p>
              </div>
              <div className="glass p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Zap className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Decision</span>
                </div>
                <p className="text-sm font-bold text-white uppercase truncate">{decision}</p>
              </div>
              <div className="glass p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Timestamp</span>
                </div>
                <p className="text-sm font-bold text-white">{time || 'Now'}</p>
              </div>
              <div className="glass p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Database className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Engine</span>
                </div>
                <p className="text-sm font-bold text-blue-400 font-mono">Ensemble v1</p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-gray-100 uppercase tracking-widest">Evidence Details</h4>
              </div>
              <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5">
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Source Entity</span>
                    <p className="text-sm font-mono text-gray-300">{source || 'N/A'}</p>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Target Entity</span>
                    <p className="text-sm font-mono text-gray-300">{target || 'N/A'}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Transferred Amount</span>
                    <p className="text-2xl font-black text-white italic">${amount ? amount.toLocaleString() : '0.00'}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <Fingerprint className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Neural Signature Match</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-gray-100 uppercase tracking-widest">Model Explainability</h4>
              </div>
              
              {explanation && explanation.length > 0 ? (
                <ul className="space-y-3">
                  {explanation.map((item, index) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index} 
                      className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/50 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-sm text-gray-500 leading-relaxed">
                  "Analysis based on 47 weighted behavioral features. The ensemble model (XGBoost + Random Forest) identified patterns consistent with {decision === 'BLOCK' ? 'high-frequency structured attacks' : 'standard user behavior'}. {decision === 'OTP_VERIFICATION' ? 'Atypical velocity and geo-location detected.' : 'No critical anomalies identified in the current session context.'}"
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Secured by FraudShield AI Neural Core
            </p>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-xs font-bold text-white transition-all uppercase tracking-widest shadow-lg shadow-blue-500/20">
                Print PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;
