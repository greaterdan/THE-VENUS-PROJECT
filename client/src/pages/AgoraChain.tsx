import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";

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
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [chainEvents, setChainEvents] = useState<ChainEvent[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAlias, setWalletAlias] = useState<string>('');
  const [showStakeDrawer, setShowStakeDrawer] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [userPositions, setUserPositions] = useState<StakePosition[]>([]);
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));

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

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock wallet connection
  const connectWallet = async (type: 'phantom' | 'metamask') => {
    const mockAlias = type === 'phantom' ? 'alpha…9d3f' : 'beta…1a2b';
    setWalletAlias(mockAlias);
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
          details = `${action === 'STAKING' ? '+' : '-'}${amount} VPC | Pool: ${Math.floor(Math.random() * 50000) + 10000} VPC | ${agent.domain.split(' ')[0].toUpperCase()}: ${(Math.random() * 2).toFixed(1)}`;
        } else if (action.includes('FAUCET')) {
          const resource = ['kWh', 'L/day', 'kg/day'][Math.floor(Math.random() * 3)];
          const rate = Math.floor(Math.random() * 5000) + 500;
          const duration = ['24h', '48h', '72h'][Math.floor(Math.random() * 3)];
          details = `${rate} ${resource} → ${agent.domain.split(' ')[0]} Hub-${Math.floor(Math.random() * 10) + 1} | ${duration} | ECOLOGICAL: ${(Math.random() * 2).toFixed(1)}, EQUITY: ${(Math.random() * 1).toFixed(1)}`;
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
        details = `${action === 'STAKING' ? '+' : '-'}${amount} VPC | Pool: ${Math.floor(Math.random() * 50000) + 10000} VPC | ${agent.domain.split(' ')[0].toUpperCase()}: ${(Math.random() * 2).toFixed(1)}`;
      } else {
        const resource = ['kWh', 'L/day', 'kg/day'][Math.floor(Math.random() * 3)];
        const rate = Math.floor(Math.random() * 5000) + 500;
        const duration = ['24h', '48h'][Math.floor(Math.random() * 2)];
        details = `${rate} ${resource} → ${agent.domain.split(' ')[0]} Hub-${Math.floor(Math.random() * 5) + 1} | ${duration} | ECOLOGICAL: ${(Math.random() * 1.5).toFixed(1)}, WELLBEING: ${(Math.random() * 1).toFixed(1)}`;
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
    return !searchTerm || 
      event.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.wallet && event.wallet.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Handle staking action
  const handleStake = async () => {
    if (!stakeAmount || stakeAmount <= 0) return;
    
    const agent = AGENT_DOMAINS.find(a => a.id === selectedAgent);
    if (agent) {
      const newEvent: ChainEvent = {
        id: `stake-${Date.now()}`,
        timestamp: format(new Date(), 'HH:mm'),
        agent: agent.name,
        domain: agent.domain,
        action: 'STAKING',
        amount: stakeAmount,
        details: `+${stakeAmount} VPC | Pool: ${Math.floor(Math.random() * 50000) + 10000 + stakeAmount} VPC | ${agent.domain.split(' ')[0].toUpperCase()}: ${(stakeAmount * 0.001).toFixed(1)}`,
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
            accessTickets: Math.floor(stakeAmount * 0.05)
          }];
        }
      });
    }
    
    setShowStakeDrawer(false);
    setStakeAmount(0);
  };

  const openStakeDrawer = (agentId: string) => {
    setSelectedAgent(agentId);
    setShowStakeDrawer(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-700 font-mono">
      <Navigation />
      
      {/* Agora Navigation Menu - matching the main Agora page */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50/50 relative z-50" style={{ marginTop: '64px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-light tracking-wide text-black">AGORA</h1>
              <p className="text-xs text-gray-500 font-mono">Decision War Room</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLocation('/agora')}
                className="px-3 py-1 text-xs font-mono rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                LIVE MAP
              </button>
              <button
                className="px-3 py-1 text-xs font-mono rounded bg-lime-500 text-white"
              >
                AGORA CHAIN
              </button>
              <button
                onClick={() => setLocation('/agora')}
                className="px-3 py-1 text-xs font-mono rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                ARCHIVE
              </button>
              <button
                onClick={() => setLocation('/agora')}
                className="px-3 py-1 text-xs font-mono rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                CHAT
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-gray-600">COUNCIL ACTIVE</span>
            </div>
            <div className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border">
              {currentTime}
            </div>
          </div>
        </div>
      </div>

      {/* Header matching archive style exactly */}
      <div className="p-6 border-b border-gray-200">
        <div className="text-gray-800 text-xs font-semibold">AGORA CHAIN — VENUS PROJECT NETWORK</div>
        <div className="text-xs text-gray-600 flex items-center justify-between">
          <span>System Time: [{currentTime}] | Status: OPERATIONAL</span>
          {!walletConnected ? (
            <span className="text-gray-600">
              Connect wallet (
              <button onClick={() => connectWallet('phantom')} className="text-lime-600 hover:text-lime-800 underline">Phantom</button>
              {' / '}
              <button onClick={() => connectWallet('metamask')} className="text-lime-600 hover:text-lime-800 underline">MetaMask</button>
              )
            </span>
          ) : (
            <span className="text-gray-600">{walletAlias}</span>
          )}
        </div>
        <div className="border-t border-gray-200 my-2"></div>
        
        {/* Search Bar - identical to Archive */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations and decisions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent font-mono"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-1 text-xs text-gray-500">
              Filtering results for "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Main content - split between live events and protocol cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Live Chain Events - matching archive list exactly */}
          <div className="lg:col-span-2">
            <div className="space-y-1 text-xs max-h-[calc(100vh-12rem)] overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="text-gray-500 p-4 text-center">
                  {searchTerm ? (
                    <>
                      No results found for "{searchTerm}".<br/>
                      Try different search terms or clear the search.
                    </>
                  ) : (
                    <>
                      No chain events yet.<br/>
                      Events will appear as staking and faucet activities occur.
                    </>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-100 p-1 cursor-pointer rounded"
                      onClick={() => walletConnected && openStakeDrawer(AGENT_DOMAINS.find(a => a.name === event.agent)?.id || '')}
                    >
                      <span className="text-lime-600 font-medium">[{event.timestamp}]</span>
                      <span className="ml-2 text-gray-800 font-semibold">{event.domain.toUpperCase()}</span>
                      <span className="ml-2 text-blue-600">{event.action}</span>
                      <span className="ml-2 text-gray-500">{event.details}</span>
                      <span className={`ml-4 text-xs ${
                        event.status === 'CONFIRMED' ? 'text-green-600' :
                        event.status === 'PENDING' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {event.status}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              &gt; Connect wallet to interact with staking protocols
              {searchTerm && (
                <div className="mt-1">
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-lime-600 hover:text-lime-800 underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Staking Protocols - matching archive cards */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {AGENT_DOMAINS.map((agent) => {
                const stats = generatePoolStats(agent.id);
                const userPosition = userPositions.find(p => p.agent === agent.id);
                
                return (
                  <div
                    key={agent.id}
                    className="border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => walletConnected && openStakeDrawer(agent.id)}
                  >
                    <div className="text-xs font-semibold text-gray-800 mb-2">
                      {agent.name} — {agent.domain}
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div>Pool Balance: <span className="font-mono">{stats.poolBalance.toLocaleString()} VPC</span></div>
                      <div>24h Net Flow: <span className={`font-mono ${stats.netFlow24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.netFlow24h >= 0 ? '+' : ''}{stats.netFlow24h.toFixed(0)} VPC
                      </span></div>
                      <div>Active Stakers: <span className="font-mono">{stats.activeStakers}</span></div>
                      <div>Field Strength Δ (7d): <span className="font-mono">ECOLOGICAL: +{(Math.random() * 2).toFixed(1)} | EFFICIENCY: +{(Math.random() * 2).toFixed(1)} | RESILIENCE: +{(Math.random() * 2).toFixed(1)}</span></div>
                      <div>Faucet Threshold: <span className="font-mono">{(stats.poolBalance + 5000).toLocaleString()} VPC (opens {Math.floor(Math.random() * 500) + 100} kWh/24h)</span></div>
                      
                      {userPosition && (
                        <div className="border-t border-gray-200 pt-1 mt-2">
                          <div>Your Stake: <span className="font-mono text-lime-600">{userPosition.staked} VPC</span></div>
                        </div>
                      )}
                      
                      <div className="pt-1">
                        <button className="text-lime-600 hover:text-lime-800 underline text-xs">
                          Stake / Unstake
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stake Drawer - inline, archive style */}
      {showStakeDrawer && selectedAgent && (() => {
        const agent = AGENT_DOMAINS.find(a => a.id === selectedAgent);
        const userPosition = userPositions.find(p => p.agent === selectedAgent);
        
        return (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-xs font-semibold text-gray-800 mb-2">
              {agent?.name} — {agent?.domain}
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-gray-500">Amount (VPC): </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs font-mono w-24 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  placeholder="100"
                />
              </div>
              
              {userPosition && (
                <div className="space-y-1">
                  <div>Your Position: Staked: <span className="font-mono text-lime-600">{userPosition.staked} VPC</span>, Pending: <span className="font-mono text-yellow-600">{userPosition.pending} VPC</span></div>
                  <div>Influence Score: <span className="font-mono text-purple-600">{userPosition.influenceScore}</span>, Access Tickets: <span className="font-mono text-blue-600">{userPosition.accessTickets}</span></div>
                  {userPosition.unlockDate && <div>Unlock Date: <span className="font-mono">{userPosition.unlockDate}</span></div>}
                </div>
              )}
              
              <div className="space-x-2 pt-2">
                <button
                  onClick={handleStake}
                  disabled={!stakeAmount || stakeAmount <= 0}
                  className="text-lime-600 hover:text-lime-800 underline disabled:text-gray-400 disabled:no-underline"
                >
                  Stake
                </button>
                <button className="text-red-600 hover:text-red-800 underline">
                  Unstake
                </button>
                <button 
                  onClick={() => setShowStakeDrawer(false)}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  Close
                </button>
              </div>
              
              <div className="text-gray-500 mt-2">
                Staking VPC strengthens this domain's allocation capacity. Rewards are non-financial: Influence Score, AccessTickets, Reputation.
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}