import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Agent {
  id: string;
  name: string;
  domain: string;
  position: { x: number; y: number };
  status: 'active' | 'processing' | 'idle';
  resources: { surplus: string[]; deficit: string[] };
  alignment: number;
}

interface Decision {
  id: string;
  title: string;
  status: 'debating' | 'voting' | 'approved' | 'implemented';
  impact: {
    ecological: number;
    wellbeing: number;
    efficiency: number;
  };
  timeline: string;
  participants: string[];
}

interface ResourceFlow {
  from: string;
  to: string;
  resource: string;
  amount: string;
  type: 'energy' | 'material' | 'data' | 'time';
}

interface ActiveCommunication {
  id: string;
  from: string;
  to: string;
  type: 'energy' | 'material' | 'data' | 'time';
  message: string;
  timestamp: number;
  duration: number;
}

// Calculate circular positions for agents around center
const centerX = 300;
const centerY = 200;
const radius = 120;

const AGENTS: Agent[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    domain: 'Infrastructure & Habitat Design',
    position: { 
      x: centerX + radius * Math.cos(0 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(0 * 2 * Math.PI / 10) - 16 
    },
    status: 'active',
    resources: { surplus: ['titanium', 'concrete'], deficit: ['energy'] },
    alignment: 94
  },
  {
    id: 'beta',
    name: 'Beta',
    domain: 'Energy Systems',
    position: { 
      x: centerX + radius * Math.cos(1 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(1 * 2 * Math.PI / 10) - 16 
    },
    status: 'processing',
    resources: { surplus: ['solar', 'wind'], deficit: ['materials'] },
    alignment: 96
  },
  {
    id: 'gamma',
    name: 'Gamma',
    domain: 'Food & Agriculture',
    position: { 
      x: centerX + radius * Math.cos(2 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(2 * 2 * Math.PI / 10) - 16 
    },
    status: 'active',
    resources: { surplus: ['biomass', 'nutrients'], deficit: ['water'] },
    alignment: 91
  },
  {
    id: 'delta',
    name: 'Delta',
    domain: 'Ecology & Environmental Restoration',
    position: { 
      x: centerX + radius * Math.cos(3 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(3 * 2 * Math.PI / 10) - 16 
    },
    status: 'idle',
    resources: { surplus: ['biodiversity'], deficit: ['time'] },
    alignment: 89
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    domain: 'Social Dynamics & Wellbeing',
    position: { 
      x: centerX + radius * Math.cos(4 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(4 * 2 * Math.PI / 10) - 16 
    },
    status: 'active',
    resources: { surplus: ['culture', 'knowledge'], deficit: ['infrastructure'] },
    alignment: 93
  },
  {
    id: 'zeta',
    name: 'Zeta',
    domain: 'Transportation & Mobility',
    position: { 
      x: centerX + radius * Math.cos(5 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(5 * 2 * Math.PI / 10) - 16 
    },
    status: 'processing',
    resources: { surplus: ['efficiency', 'networks'], deficit: ['energy'] },
    alignment: 88
  },
  {
    id: 'eta',
    name: 'Eta',
    domain: 'Health & Medical Systems',
    position: { 
      x: centerX + radius * Math.cos(6 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(6 * 2 * Math.PI / 10) - 16 
    },
    status: 'active',
    resources: { surplus: ['diagnostics', 'prevention'], deficit: ['materials'] },
    alignment: 95
  },
  {
    id: 'theta',
    name: 'Theta',
    domain: 'Education & Knowledge Access',
    position: { 
      x: centerX + radius * Math.cos(7 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(7 * 2 * Math.PI / 10) - 16 
    },
    status: 'processing',
    resources: { surplus: ['knowledge', 'analysis'], deficit: ['time'] },
    alignment: 92
  },
  {
    id: 'iota',
    name: 'Iota',
    domain: 'Resource Management & Allocation',
    position: { 
      x: centerX + radius * Math.cos(8 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(8 * 2 * Math.PI / 10) - 16 
    },
    status: 'active',
    resources: { surplus: ['inventory', 'data'], deficit: ['distribution'] },
    alignment: 90
  },
  {
    id: 'kappa',
    name: 'Kappa',
    domain: 'Culture, Ethics & Governance',
    position: { 
      x: centerX + radius * Math.cos(9 * 2 * Math.PI / 10) - 16, 
      y: centerY + radius * Math.sin(9 * 2 * Math.PI / 10) - 16 
    },
    status: 'active',
    resources: { surplus: ['wisdom', 'balance'], deficit: ['consensus'] },
    alignment: 97
  }
];

const CURRENT_DECISION: Decision = {
  id: 'habitat-expansion',
  title: 'Sustainable Habitat Expansion Protocol',
  status: 'voting',
  impact: {
    ecological: 78,
    wellbeing: 85,
    efficiency: 92
  },
  timeline: '72 hours',
  participants: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']
};

// Communication patterns that cycle through different agent pairs
const COMMUNICATION_PATTERNS = [
  { from: 'alpha', to: 'beta', type: 'energy', message: 'Requesting 156 kWh for construction Phase 3', amount: '156 kWh' },
  { from: 'beta', to: 'alpha', type: 'energy', message: 'Solar array output confirmed - 156 kWh available', amount: '156 kWh' },
  { from: 'gamma', to: 'iota', type: 'material', message: 'Need 890L water allocation for vertical farms', amount: '890L' },
  { from: 'iota', to: 'gamma', type: 'material', message: 'Water distribution optimized - allocation confirmed', amount: '890L' },
  { from: 'delta', to: 'epsilon', type: 'data', message: 'Biodiversity metrics show 12% improvement', amount: '2.4GB' },
  { from: 'epsilon', to: 'kappa', type: 'data', message: 'Social wellbeing index: 94.7% consensus reached', amount: '1.2MB' },
  { from: 'eta', to: 'theta', type: 'data', message: 'Health diagnostics ready for education integration', amount: '850MB' },
  { from: 'theta', to: 'kappa', type: 'data', message: 'Learning optimization models updated', amount: '420MB' },
  { from: 'zeta', to: 'iota', type: 'data', message: 'Transport efficiency at 98.2% - resource saved', amount: '1.8GB' },
  { from: 'kappa', to: 'alpha', type: 'time', message: 'Cultural impact assessment complete - proceed', amount: '3.2 hrs' },
  { from: 'alpha', to: 'delta', type: 'material', message: 'Eco-friendly concrete mixture ready for testing', amount: '2.4 tons' },
  { from: 'beta', to: 'zeta', type: 'energy', message: 'Power allocation for transport grid upgrade', amount: '88 kWh' }
] as const;

const ARCHIVE_DECISIONS = [
  { id: 1, title: 'Solar Array Recalibration', status: 'IMPLEMENTED', timestamp: '14:18:23', impact: '+18% efficiency' },
  { id: 2, title: 'Biodiversity Restoration Phase 3', status: 'APPROVED', timestamp: '14:15:07', impact: '+12% ecosystem health' },
  { id: 3, title: 'Transport Network Optimization', status: 'IMPLEMENTED', timestamp: '14:12:45', impact: 'Zero emissions achieved' },
  { id: 4, title: 'Agricultural Yield Enhancement', status: 'APPROVED', timestamp: '14:09:33', impact: '+18% food production' },
  { id: 5, title: 'Healthcare System Upgrade', status: 'IMPLEMENTED', timestamp: '14:06:12', impact: '97.3% diagnostic accuracy' }
];

const AgentNode = ({ agent, isSelected, onClick }: { agent: Agent; isSelected: boolean; onClick: () => void }) => {
  const statusColors = {
    active: 'bg-green-400 shadow-green-200',
    processing: 'bg-yellow-400 shadow-yellow-200',
    idle: 'bg-gray-400 shadow-gray-200'
  };

  return (
    <motion.div
      className={`absolute cursor-pointer`}
      style={{ left: agent.position.x, top: agent.position.y }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <div className={`w-8 h-8 rounded-full ${statusColors[agent.status]} shadow-lg flex items-center justify-center`}>
        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">{agent.name[0]}</span>
        </div>
      </div>
      {agent.status === 'active' && (
        <div className="absolute inset-0 w-8 h-8 rounded-full bg-green-400 animate-ping opacity-20"></div>
      )}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-600 whitespace-nowrap">
        {agent.name}
      </div>
    </motion.div>
  );
};

const DynamicConnectionLine = ({ 
  communication, 
  agents, 
  isActive 
}: { 
  communication: ActiveCommunication; 
  agents: Agent[]; 
  isActive: boolean; 
}) => {
  const fromAgent = agents.find(a => a.id === communication.from);
  const toAgent = agents.find(a => a.id === communication.to);
  
  if (!fromAgent || !toAgent || !isActive) return null;

  const flowColors = {
    energy: '#facc15',
    material: '#60a5fa', 
    data: '#a78bfa',
    time: '#4ade80'
  };

  const x1 = fromAgent.position.x + 16;
  const y1 = fromAgent.position.y + 16;
  const x2 = toAgent.position.x + 16;
  const y2 = toAgent.position.y + 16;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Connection Line */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={flowColors[communication.type]}
        strokeWidth="3"
        strokeOpacity="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Animated Resource Particle */}
      <circle
        r="5"
        fill={flowColors[communication.type]}
        opacity="0.9"
      >
        <animateMotion
          dur="2s"
          repeatCount="1"
          path={`M ${x1},${y1} L ${x2},${y2}`}
        />
        <animate
          attributeName="r"
          values="3;5;3"
          dur="1s"
          repeatCount="2"
        />
      </circle>
      
      {/* Resource Amount Label */}
      <text
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2 - 15}
        textAnchor="middle"
        fontSize="11"
        fill={flowColors[communication.type]}
        className="font-mono font-semibold"
      >
        {communication.message.split(' ')[0]} {communication.message.includes('kWh') ? communication.message.match(/\d+\.?\d*\s*kWh/)?.[0] : communication.message.includes('L') ? communication.message.match(/\d+\.?\d*L/)?.[0] : communication.message.includes('GB') ? communication.message.match(/\d+\.?\d*\s*GB/)?.[0] : communication.message.includes('MB') ? communication.message.match(/\d+\.?\d*\s*MB/)?.[0] : communication.message.includes('hrs') ? communication.message.match(/\d+\.?\d*\s*hrs/)?.[0] : communication.message.includes('tons') ? communication.message.match(/\d+\.?\d*\s*tons/)?.[0] : ''}
      </text>
    </motion.g>
  );
};

const MetricGauge = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={color}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-600 mt-1">{label}</span>
    </div>
  );
};

export default function Agora() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [viewMode, setViewMode] = useState<'live' | 'archive'>('live');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const [activeCommunications, setActiveCommunications] = useState<ActiveCommunication[]>([]);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Dynamic communication simulation
  useEffect(() => {
    const communicationInterval = setInterval(() => {
      const pattern = COMMUNICATION_PATTERNS[currentPatternIndex];
      const newCommunication: ActiveCommunication = {
        id: `comm-${Date.now()}`,
        from: pattern.from,
        to: pattern.to,
        type: pattern.type,
        message: pattern.message,
        timestamp: Date.now(),
        duration: 4000 // 4 seconds
      };

      setActiveCommunications(prev => [...prev, newCommunication]);

      // Remove communication after duration
      setTimeout(() => {
        setActiveCommunications(prev => prev.filter(c => c.id !== newCommunication.id));
      }, newCommunication.duration);

      // Move to next pattern
      setCurrentPatternIndex(prev => (prev + 1) % COMMUNICATION_PATTERNS.length);
    }, 2500); // New communication every 2.5 seconds

    return () => clearInterval(communicationInterval);
  }, [currentPatternIndex]);

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-light tracking-wide text-black">AGORA</h1>
              <p className="text-xs text-gray-500 font-mono">Decision War Room</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('live')}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  viewMode === 'live' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                LIVE MAP
              </button>
              <button
                onClick={() => setViewMode('archive')}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  viewMode === 'archive' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                ARCHIVE
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

      <div className="flex h-screen">
        
        {viewMode === 'live' ? (
          <>
            {/* Live Decision Map */}
            <div className="w-2/3 relative bg-gray-50/30 border-r border-gray-200">
              
              {/* Decision Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-lime-500 p-3 w-56">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-lime-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                    <h3 className="font-semibold text-xs text-gray-800">{CURRENT_DECISION.title}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{CURRENT_DECISION.status}</p>
                    <div className="mt-2 text-xs text-gray-600">
                      Timeline: <span className="font-mono">{CURRENT_DECISION.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Network */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
                <AnimatePresence>
                  {activeCommunications.map((communication) => (
                    <DynamicConnectionLine 
                      key={communication.id} 
                      communication={communication} 
                      agents={AGENTS} 
                      isActive={true}
                    />
                  ))}
                </AnimatePresence>
              </svg>

              {AGENTS.map(agent => (
                <AgentNode
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent?.id === agent.id}
                  onClick={() => setSelectedAgent(agent)}
                />
              ))}

              {/* Agent Detail Panel */}
              <AnimatePresence>
                {selectedAgent && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg border p-4 w-64"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Agent {selectedAgent.name}</h4>
                      <button
                        onClick={() => setSelectedAgent(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-gray-500">Domain:</span>
                        <span className="ml-2 font-mono">{selectedAgent.domain}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Alignment:</span>
                        <span className="ml-2 font-mono">{selectedAgent.alignment}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Surplus:</span>
                        <div className="ml-2 text-green-600">{selectedAgent.resources.surplus.join(', ')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Needs:</span>
                        <div className="ml-2 text-red-600">{selectedAgent.resources.deficit.join(', ')}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Decision Metrics Panel */}
            <div className="w-1/3 bg-white p-6 overflow-y-auto">
              <div className="space-y-6">
                
                {/* Current Decision Metrics */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Decision Impact Analysis</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <MetricGauge label="Ecological" value={CURRENT_DECISION.impact.ecological} color="text-green-500" />
                    <MetricGauge label="Wellbeing" value={CURRENT_DECISION.impact.wellbeing} color="text-blue-500" />
                    <MetricGauge label="Efficiency" value={CURRENT_DECISION.impact.efficiency} color="text-purple-500" />
                  </div>
                </div>

                {/* Active Communications */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Live Communications</h3>
                  <div className="space-y-3">
                    {activeCommunications.slice(-5).map((comm) => (
                      <motion.div 
                        key={comm.id} 
                        className="bg-gray-50 rounded p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-gray-600">
                            {comm.from.toUpperCase()} → {comm.to.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded text-white ${
                            comm.type === 'energy' ? 'bg-yellow-400' :
                            comm.type === 'material' ? 'bg-blue-400' :
                            comm.type === 'data' ? 'bg-purple-400' : 'bg-green-400'
                          }`}>
                            {comm.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-800 mt-1">{comm.message}</div>
                      </motion.div>
                    ))}
                    {activeCommunications.length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-4">
                        Listening for agent communications...
                      </div>
                    )}
                  </div>
                </div>

                {/* System Status */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">System Status</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Network Consensus</span>
                      <span className="font-mono">94.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Agents</span>
                      <span className="font-mono">{AGENTS.filter(a => a.status === 'active').length}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Latency</span>
                      <span className="font-mono">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Decision Queue</span>
                      <span className="font-mono">3 pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Archive View */
          <div className="w-full bg-black text-green-400 font-mono p-6">
            <div className="mb-4">
              <div className="text-yellow-400 text-xs">DECISION ARCHIVE - VENUS PROJECT AGORA</div>
              <div className="text-xs">System Time: {currentTime} | Status: OPERATIONAL</div>
              <div className="border-t border-green-800 my-2"></div>
            </div>
            
            <div className="space-y-1 text-xs">
              {ARCHIVE_DECISIONS.map((decision) => (
                <div key={decision.id} className="hover:bg-green-900/20 p-1 cursor-pointer">
                  <span className="text-yellow-400">[{decision.timestamp}]</span>
                  <span className="ml-2">{decision.title}</span>
                  <span className="ml-4 text-cyan-400">{decision.status}</span>
                  <span className="ml-4 text-gray-400">{decision.impact}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              &gt; Use LIVE MAP mode to view active decision processes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}