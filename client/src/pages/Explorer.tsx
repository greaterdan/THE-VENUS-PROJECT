import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionDetails {
  id: string;
  timestamp: string;
  agent: string;
  domain: string;
  action: string;
  amount?: number;
  details: string;
  poolBalance?: number;
  wallet?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  blockHeight?: number;
  gasUsed?: number;
  fee?: number;
  hash?: string;
}

export default function Explorer() {
  const [, setLocation] = useLocation();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get transaction ID from URL or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txId = urlParams.get('tx') || localStorage.getItem('explorerTx');
    
    if (txId) {
      // Generate realistic transaction data based on the transaction ID
      const agents = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA', 'ETA', 'THETA', 'IOTA', 'KAPPA'];
      const domains = [
        'INFRASTRUCTURE & HABITAT DESIGN',
        'ENERGY SYSTEMS',
        'FOOD & AGRICULTURE', 
        'ECOLOGY & ENVIRONMENTAL RESTORATION',
        'SOCIAL DYNAMICS & WELLBEING',
        'TRANSPORTATION & MOBILITY',
        'HEALTH & MEDICAL SYSTEMS',
        'EDUCATION & KNOWLEDGE ACCESS',
        'RESOURCE MANAGEMENT & ALLOCATION',
        'CULTURE, ETHICS & GOVERNANCE'
      ];
      const actions = ['STAKING', 'UNSTAKING', 'FAUCET OPENED'];
      
      // Use transaction ID to generate consistent but varied data
      const seedNumber = txId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const agentIndex = seedNumber % agents.length;
      const domainIndex = agentIndex;
      const actionIndex = seedNumber % actions.length;
      const amount = 100 + (seedNumber % 2000);
      const poolBalance = 10000 + (seedNumber % 90000);
      
      setTransaction({
        id: txId,
        timestamp: new Date(Date.now() - (seedNumber % 3600000)).toISOString(), // Random time within last hour
        agent: agents[agentIndex],
        domain: domains[domainIndex],
        action: actions[actionIndex],
        amount: actions[actionIndex] !== 'FAUCET OPENED' ? amount : undefined,
        details: actions[actionIndex] === 'FAUCET OPENED' 
          ? `${amount * 10} L/day → ${domains[domainIndex].split(' ')[0]} Hub-${(seedNumber % 5) + 1} | 24h | ECOLOGICAL: ${((seedNumber % 30) / 10).toFixed(1)}`
          : `${actions[actionIndex] === 'STAKING' ? '+' : '-'}${amount} VPC by ${['alpha', 'beta', 'gamma'][seedNumber % 3]}${seedNumber.toString().slice(-3)} | Pool: ${poolBalance} VPC | ${domains[domainIndex].split(' ')[0].toUpperCase()}: ${((seedNumber % 50) / 10).toFixed(1)}`,
        poolBalance: poolBalance,
        wallet: `${['alpha', 'beta', 'gamma', 'delta'][seedNumber % 4]}${seedNumber.toString().slice(-3)}…${Math.random().toString(36).substr(2, 3)}`,
        status: seedNumber % 10 === 0 ? 'FAILED' : (seedNumber % 20 === 0 ? 'PENDING' : 'CONFIRMED'),
        blockHeight: 750000 + (seedNumber % 250000),
        gasUsed: 15000 + (seedNumber % 35000),
        fee: 0.0001 + ((seedNumber % 50) / 1000000),
        hash: `0x${seedNumber.toString(16).padStart(8, '0')}${Math.random().toString(16).substr(2, 56)}`
      });
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading transaction...</div>
      </div>
    );
  }

  const StatusIcon = () => {
    switch (transaction.status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="bg-white border-b border-gray-200 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.button
              onClick={() => setLocation('/agora-chain')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Chain
            </motion.button>
            <div className="text-sm font-mono text-gray-800">
              [{currentTime}] AGORA CHAIN EXPLORER
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Block #{transaction.blockHeight?.toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Transaction Status */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <StatusIcon />
                <span className="ml-2 font-semibold text-gray-900">
                  Transaction {transaction.status.toLowerCase()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm:ss')}
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {transaction.action} • {transaction.agent}
            </div>
            <div className="text-gray-600 mb-4">
              {transaction.domain}
            </div>
            
            {transaction.amount && (
              <div className="inline-flex items-center bg-lime-50 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                {transaction.action === 'STAKING' ? '+' : '-'}{transaction.amount?.toLocaleString()} VPC
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Transaction Hash</div>
                    <div className="flex items-center">
                      <span className="font-mono text-sm text-gray-900 mr-2">
                        {formatHash(transaction.hash || '')}
                      </span>
                      <motion.button
                        onClick={() => copyToClipboard(transaction.hash || '')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">From Wallet</div>
                    <div className="flex items-center">
                      <span className="font-mono text-sm text-gray-900 mr-2">
                        {transaction.wallet}
                      </span>
                      <motion.button
                        onClick={() => copyToClipboard(transaction.wallet || '')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Block Height</div>
                    <div className="font-mono text-sm text-gray-900">
                      {transaction.blockHeight?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Pool Balance</div>
                    <div className="font-mono text-sm text-gray-900">
                      {transaction.poolBalance?.toLocaleString()} VPC
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Gas Used</div>
                    <div className="font-mono text-sm text-gray-900">
                      {transaction.gasUsed?.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Transaction Fee</div>
                    <div className="font-mono text-sm text-gray-900">
                      {transaction.fee} VPC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Data */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Raw Transaction Data</h2>
            </div>
            <div className="p-6">
              <pre className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-700 overflow-x-auto">
{JSON.stringify({
  id: transaction.id,
  timestamp: transaction.timestamp,
  agent: transaction.agent,
  domain: transaction.domain,
  action: transaction.action,
  amount: transaction.amount,
  details: transaction.details,
  poolBalance: transaction.poolBalance,
  wallet: transaction.wallet,
  status: transaction.status,
  blockHeight: transaction.blockHeight,
  gasUsed: transaction.gasUsed,
  fee: transaction.fee,
  hash: transaction.hash
}, null, 2)}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copy Success Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}