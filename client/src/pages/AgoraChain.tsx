import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Agent domain mapping
const AGENT_DOMAINS = [
  { id: 'alpha', name: 'ALPHA', domain: 'Infrastructure & Habitat' },
  { id: 'beta', name: 'BETA', domain: 'Energy Systems' },
  { id: 'gamma', name: 'GAMMA', domain: 'Food & Agriculture' },
  { id: 'delta', name: 'DELTA', domain: 'Ecology & Restoration' },
  { id: 'epsilon', name: 'EPSILON', domain: 'Social & Wellbeing' },
  { id: 'zeta', name: 'ZETA', domain: 'Transportation & Mobility' },
  { id: 'eta', name: 'ETA', domain: 'Health & Medical' },
  { id: 'theta', name: 'THETA', domain: 'Education & Knowledge' },
  { id: 'iota', name: 'IOTA', domain: 'Resource Management' },
  { id: 'kappa', name: 'KAPPA', domain: 'Culture, Ethics & Governance' }
];

interface ChainEvent {
  id: string;
  timestamp: string;
  agent: string;
  domain: string;
  action: 'STAKING' | 'UNSTAKING' | 'FAUCET OPENED' | 'FAUCET CLOSED' | 'ATTESTED' | 'REJECTED' | 'ROLLED BACK' | 'FAILED';
  amount?: number;
  details: string;
  poolBalance?: number;
  impact?: {
    ecological?: number;
    wellbeing?: number;
    efficiency?: number;
    resilience?: number;
    equity?: number;
    innovation?: number;
  };
  wallet?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

interface StakePosition {
  agent: string;
  staked: number;
  pending: number;
  unlockDate?: string;
  influenceScore: number;
  accessTickets: number;
  lockPeriod?: number;
}

export default function AgoraChain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'All' | 'Stakes' | 'Faucets' | 'Attestations'>('All');
  const [chainEvents, setChainEvents] = useState<ChainEvent[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletAlias, setWalletAlias] = useState<string>('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [lockPeriod, setLockPeriod] = useState<number>(7);
  const [userPositions, setUserPositions] = useState<StakePosition[]>([]);
  const [isLoadingStake, setIsLoadingStake] = useState(false);
  const chainFeedRef = useRef<HTMLDivElement>(null);

  // Generate pool statistics for each agent
  const generatePoolStats = (agentId: string) => {
    const basePool = Math.floor(Math.random() * 50000) + 10000;
    const activeStakers = Math.floor(Math.random() * 200) + 50;
    const netFlow = (Math.random() - 0.5) * 2000;
    
    return {
      poolBalance: basePool,
      activeStakers,
      netFlow24h: netFlow,
      fieldStrength: Math.random() * 2 - 1
    };
  };

  // Mock wallet connection
  const connectWallet = async (type: 'phantom' | 'metamask') => {
    try {
      // Simulate wallet connection
      const mockAddress = type === 'phantom' 
        ? 'pha7...9d3f' 
        : '0x742...1a2b';
      
      setWalletAddress(mockAddress);
      setWalletAlias(mockAddress);
      setWalletConnected(true);
      
      // Generate mock positions
      const positions: StakePosition[] = AGENT_DOMAINS.slice(0, 3).map(agent => ({
        agent: agent.id,
        staked: Math.floor(Math.random() * 1000) + 100,
        pending: Math.floor(Math.random() * 100),
        unlockDate: Math.random() > 0.5 ? format(new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') : undefined,
        influenceScore: Math.floor(Math.random() * 100) + 50,
        accessTickets: Math.floor(Math.random() * 10) + 2,
        lockPeriod: [7, 30, 90][Math.floor(Math.random() * 3)]
      }));
      
      setUserPositions(positions);
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  // Generate initial chain events
  useEffect(() => {
    const generateInitialEvents = () => {
      const events: ChainEvent[] = [];
      const now = new Date();
      
      for (let i = 0; i < 20; i++) {
        const agent = AGENT_DOMAINS[Math.floor(Math.random() * AGENT_DOMAINS.length)];
        const timestamp = new Date(now.getTime() - i * 60 * 1000); // Every minute backwards
        const actions: ChainEvent['action'][] = ['STAKING', 'UNSTAKING', 'FAUCET OPENED', 'FAUCET CLOSED', 'ATTESTED'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        let details = '';
        let amount;
        let impact;
        
        if (action === 'STAKING' || action === 'UNSTAKING') {
          amount = Math.floor(Math.random() * 1000) + 100;
          const wallet = `${['alpha', 'beta', 'gamma', 'delta'][Math.floor(Math.random() * 4)]}…${Math.random().toString(36).substr(2, 3)}`;
          details = `${action === 'STAKING' ? '+' : '-'}${amount} VPC by ${wallet} | Pool: ${Math.floor(Math.random() * 50000) + 10000} VPC | ${agent.domain.split(' ')[0]} +${(Math.random() * 2).toFixed(1)}`;
        } else if (action.includes('FAUCET')) {
          const resource = ['kWh', 'L/day', 'kg/day', 'units/day'][Math.floor(Math.random() * 4)];
          const rate = Math.floor(Math.random() * 10000) + 1000;
          const duration = ['24h', '48h', '72h'][Math.floor(Math.random() * 3)];
          details = `${rate} ${resource} → ${agent.domain.split(' ')[0]} Hub-${Math.floor(Math.random() * 10) + 1} (${duration})`;
          
          impact = {
            ecological: Math.random() * 2,
            wellbeing: Math.random() * 2,
            efficiency: Math.random() * 2,
            resilience: Math.random() * 2,
            equity: Math.random() * 2,
            innovation: Math.random() * 2
          };
        } else {
          details = `Verification completed for ${agent.domain} protocol update`;
        }
        
        events.push({
          id: `event-${timestamp.getTime()}`,
          timestamp: format(timestamp, 'HH:mm'),
          agent: agent.name,
          domain: agent.domain,
          action,
          amount,
          details,
          poolBalance: Math.floor(Math.random() * 50000) + 10000,
          impact,
          status: Math.random() > 0.1 ? 'CONFIRMED' : 'PENDING'
        });
      }
      
      return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    };
    
    setChainEvents(generateInitialEvents());
  }, []);

  // Simulate real-time events
  useEffect(() => {
    const interval = setInterval(() => {
      const agent = AGENT_DOMAINS[Math.floor(Math.random() * AGENT_DOMAINS.length)];
      const actions: ChainEvent['action'][] = ['STAKING', 'UNSTAKING', 'FAUCET OPENED'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      let details = '';
      let amount;
      let impact;
      
      if (action === 'STAKING' || action === 'UNSTAKING') {
        amount = Math.floor(Math.random() * 500) + 50;
        const wallet = `${['alpha', 'beta', 'gamma'][Math.floor(Math.random() * 3)]}…${Math.random().toString(36).substr(2, 3)}`;
        details = `${action === 'STAKING' ? '+' : '-'}${amount} VPC by ${wallet} | Pool: ${Math.floor(Math.random() * 50000) + 10000} VPC | ${agent.domain.split(' ')[0]} +${(Math.random() * 2).toFixed(1)}`;
      } else {
        const resource = ['kWh', 'L/day', 'kg/day'][Math.floor(Math.random() * 3)];
        const rate = Math.floor(Math.random() * 5000) + 500;
        const duration = ['24h', '48h'][Math.floor(Math.random() * 2)];
        details = `${rate} ${resource} → ${agent.domain.split(' ')[0]} Hub-${Math.floor(Math.random() * 5) + 1} (${duration})`;
        
        impact = {
          ecological: Math.random() * 1.5,
          wellbeing: Math.random() * 1.5,
          efficiency: Math.random() * 1.5,
          resilience: Math.random() * 1.5,
          equity: Math.random() * 1.5,
          innovation: Math.random() * 1.5
        };
      }
      
      const newEvent: ChainEvent = {
        id: `event-${Date.now()}`,
        timestamp: format(new Date(), 'HH:mm'),
        agent: agent.name,
        domain: agent.domain,
        action,
        amount,
        details,
        poolBalance: Math.floor(Math.random() * 50000) + 10000,
        impact,
        status: 'CONFIRMED'
      };
      
      setChainEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep only latest 50 events
    }, 15000); // New event every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Filter events
  const filteredEvents = chainEvents.filter(event => {
    const matchesSearch = !searchTerm || 
      event.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'All' || 
      (filterType === 'Stakes' && (event.action === 'STAKING' || event.action === 'UNSTAKING')) ||
      (filterType === 'Faucets' && event.action.includes('FAUCET')) ||
      (filterType === 'Attestations' && (event.action === 'ATTESTED' || event.action === 'REJECTED'));
    
    return matchesSearch && matchesFilter;
  });

  // Handle staking action
  const handleStake = async () => {
    if (!stakeAmount || stakeAmount <= 0) return;
    
    setIsLoadingStake(true);
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const agent = AGENT_DOMAINS.find(a => a.id === selectedAgent);
    if (agent) {
      const newEvent: ChainEvent = {
        id: `stake-${Date.now()}`,
        timestamp: format(new Date(), 'HH:mm'),
        agent: agent.name,
        domain: agent.domain,
        action: 'STAKING',
        amount: stakeAmount,
        details: `+${stakeAmount} VPC by ${walletAlias} | Pool: ${Math.floor(Math.random() * 50000) + 10000 + stakeAmount} VPC | ${agent.domain.split(' ')[0]} +${(stakeAmount * 0.001).toFixed(1)}`,
        poolBalance: Math.floor(Math.random() * 50000) + 10000 + stakeAmount,
        status: 'CONFIRMED',
        wallet: walletAlias
      };
      
      setChainEvents(prev => [newEvent, ...prev]);
      
      // Update user position
      setUserPositions(prev => {
        const existing = prev.find(p => p.agent === selectedAgent);
        if (existing) {
          return prev.map(p => p.agent === selectedAgent 
            ? { ...p, staked: p.staked + stakeAmount, influenceScore: p.influenceScore + Math.floor(stakeAmount * 0.1) }
            : p
          );
        } else {
          return [...prev, {
            agent: selectedAgent,
            staked: stakeAmount,
            pending: 0,
            influenceScore: Math.floor(stakeAmount * 0.1),
            accessTickets: Math.floor(stakeAmount * 0.05),
            lockPeriod
          }];
        }
      });
    }
    
    setIsLoadingStake(false);
    setShowStakeModal(false);
    setStakeAmount(0);
  };

  const openStakeModal = (agentId: string) => {
    setSelectedAgent(agentId);
    setShowStakeModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header matching archive style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light text-gray-800 mb-2">Agora Chain</h1>
              <p className="text-gray-600">Real-time staking and resource allocation events</p>
            </div>
            
            {/* Wallet controls */}
            <div className="flex items-center gap-4">
              {!walletConnected ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => connectWallet('phantom')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Connect Phantom
                  </button>
                  <button
                    onClick={() => connectWallet('metamask')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    Connect MetaMask
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded font-mono">
                  {walletAlias}
                </div>
              )}
            </div>
          </div>

          {/* Search and filters matching archive style */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              {['All', 'Stakes', 'Faucets', 'Attestations'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter as any)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filterType === filter
                      ? 'bg-lime-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Chain events feed - matching archive list style */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Live Chain Events</h2>
                <p className="text-sm text-gray-600 mt-1">Real-time feed of staking and resource activities</p>
              </div>
              
              <div ref={chainFeedRef} className="max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => walletConnected && openStakeModal(AGENT_DOMAINS.find(a => a.name === event.agent)?.id || '')}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                [{event.timestamp}]
                              </span>
                              <span className="font-semibold text-gray-800">
                                {event.domain.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded font-mono ${
                                event.action === 'STAKING' ? 'bg-green-100 text-green-800' :
                                event.action === 'UNSTAKING' ? 'bg-red-100 text-red-800' :
                                event.action.includes('FAUCET') ? 'bg-blue-100 text-blue-800' :
                                event.action === 'ATTESTED' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {event.action}
                              </span>
                              {event.amount && (
                                <span className="text-sm text-gray-600">
                                  {event.action === 'STAKING' ? '+' : event.action === 'UNSTAKING' ? '-' : ''}{event.amount} VPC
                                </span>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-700 font-mono mb-2">
                              {event.details}
                            </div>
                            
                            {event.impact && (
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-gray-500">Impact:</span>
                                {Object.entries(event.impact).filter(([, value]) => value > 0.1).map(([key, value]) => (
                                  <span key={key} className={`${
                                    key === 'ecological' ? 'text-green-600' :
                                    key === 'wellbeing' ? 'text-blue-600' :
                                    key === 'efficiency' ? 'text-purple-600' :
                                    key === 'resilience' ? 'text-orange-600' :
                                    key === 'equity' ? 'text-pink-600' :
                                    'text-indigo-600'
                                  }`}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)} +{value.toFixed(1)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded ${
                              event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              event.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar - Agent pools */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Staking Pools</h3>
                <p className="text-sm text-gray-600 mt-1">Click to stake or view details</p>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {AGENT_DOMAINS.map((agent) => {
                  const stats = generatePoolStats(agent.id);
                  const userPosition = userPositions.find(p => p.agent === agent.id);
                  
                  return (
                    <div
                      key={agent.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => walletConnected && openStakeModal(agent.id)}
                    >
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-gray-800">{agent.name}</span>
                          <span className="text-xs text-gray-500">{stats.activeStakers} stakers</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{agent.domain}</div>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pool Balance:</span>
                          <span className="font-mono">{stats.poolBalance.toLocaleString()} VPC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">24h Flow:</span>
                          <span className={`font-mono ${stats.netFlow24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.netFlow24h >= 0 ? '+' : ''}{stats.netFlow24h.toFixed(0)} VPC
                          </span>
                        </div>
                        {userPosition && (
                          <div className="border-t border-gray-200 pt-1 mt-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Your Stake:</span>
                              <span className="font-mono text-lime-600">{userPosition.staked} VPC</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      <AnimatePresence>
        {showStakeModal && selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowStakeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              {(() => {
                const agent = AGENT_DOMAINS.find(a => a.id === selectedAgent);
                const stats = generatePoolStats(selectedAgent);
                const userPosition = userPositions.find(p => p.agent === selectedAgent);
                
                return (
                  <>
                    {/* Modal Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{agent?.name} Pool</h3>
                          <p className="text-sm text-gray-600">{agent?.domain}</p>
                        </div>
                        <button
                          onClick={() => setShowStakeModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Pool Stats */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Pool Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-gray-500">Pool Balance</div>
                          <div className="font-mono text-gray-800">{stats.poolBalance.toLocaleString()} VPC</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Active Stakers</div>
                          <div className="font-mono text-gray-800">{stats.activeStakers}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">24h Net Flow</div>
                          <div className={`font-mono ${stats.netFlow24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.netFlow24h >= 0 ? '+' : ''}{stats.netFlow24h.toFixed(0)} VPC
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Field Strength Δ</div>
                          <div className={`font-mono ${stats.fieldStrength >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.fieldStrength >= 0 ? '+' : ''}{stats.fieldStrength.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Staking Form */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Stake VPC</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Amount (VPC)</label>
                          <input
                            type="number"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-lime-500"
                            placeholder="Enter amount"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Lock Period</label>
                          <select
                            value={lockPeriod}
                            onChange={(e) => setLockPeriod(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
                          >
                            <option value={7}>7 days (1.0x Influence)</option>
                            <option value={30}>30 days (1.5x Influence)</option>
                            <option value={90}>90 days (2.0x Influence)</option>
                          </select>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={handleStake}
                            disabled={!stakeAmount || stakeAmount <= 0 || isLoadingStake}
                            className="flex-1 px-4 py-2 bg-lime-500 text-white rounded text-sm font-semibold hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoadingStake ? 'Staking...' : 'Stake'}
                          </button>
                          <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600">
                            Unstake
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* User Position */}
                    {userPosition && (
                      <div className="p-6 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Your Position</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-gray-500">Staked</div>
                            <div className="font-mono text-lime-600">{userPosition.staked} VPC</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Pending</div>
                            <div className="font-mono text-yellow-600">{userPosition.pending} VPC</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Influence Score</div>
                            <div className="font-mono text-purple-600">{userPosition.influenceScore}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Access Tickets</div>
                            <div className="font-mono text-blue-600">{userPosition.accessTickets}</div>
                          </div>
                        </div>
                        {userPosition.unlockDate && (
                          <div className="mt-2 text-xs">
                            <span className="text-gray-500">Unlock Date: </span>
                            <span className="font-mono text-gray-800">{userPosition.unlockDate}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Security Note */}
                    <div className="p-6 bg-gray-50">
                      <p className="text-xs text-gray-600">
                        <strong>Note:</strong> Staking VPC strengthens this domain's allocation capacity. 
                        Rewards are non-financial: Influence Score, AccessTickets, Reputation.
                      </p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}