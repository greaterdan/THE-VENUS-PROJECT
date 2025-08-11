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

interface ActiveConnection {
  id: string;
  from: string;
  to: string;
  type: 'energy' | 'material' | 'data' | 'time';
  message: string;
  timestamp: number;
}



// Position agents in network formation centered in the map (viewBox is 600x400)
const mapCenterX = 300;
const mapCenterY = 200;

const AGENTS: Agent[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    domain: 'Infrastructure & Habitat Design',
    position: { x: 200, y: 150 }, // Left side - centered better
    status: 'active',
    resources: { surplus: ['titanium', 'concrete'], deficit: ['energy'] },
    alignment: 94
  },
  {
    id: 'beta',
    name: 'Beta',
    domain: 'Energy Systems',
    position: { x: 360, y: 110 }, // Top center - moved more central
    status: 'processing',
    resources: { surplus: ['solar', 'wind'], deficit: ['materials'] },
    alignment: 96
  },
  {
    id: 'gamma',
    name: 'Gamma',
    domain: 'Food & Agriculture',
    position: { x: 520, y: 150 }, // Right side - well spaced
    status: 'active',
    resources: { surplus: ['biomass', 'nutrients'], deficit: ['water'] },
    alignment: 91
  },
  {
    id: 'delta',
    name: 'Delta',
    domain: 'Ecology & Environmental Restoration',
    position: { x: 260, y: 190 }, // Left-center - better centered
    status: 'idle',
    resources: { surplus: ['biodiversity'], deficit: ['time'] },
    alignment: 89
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    domain: 'Social Dynamics & Wellbeing',
    position: { x: 460, y: 180 }, // Center-right - more spread
    status: 'active',
    resources: { surplus: ['culture', 'knowledge'], deficit: ['infrastructure'] },
    alignment: 93
  },
  {
    id: 'zeta',
    name: 'Zeta',
    domain: 'Transportation & Mobility',
    position: { x: 510, y: 230 }, // Right-center - better spacing
    status: 'processing',
    resources: { surplus: ['efficiency', 'networks'], deficit: ['energy'] },
    alignment: 88
  },
  {
    id: 'eta',
    name: 'Eta',
    domain: 'Health & Medical Systems',
    position: { x: 210, y: 270 }, // Left-bottom - more centered
    status: 'active',
    resources: { surplus: ['diagnostics', 'prevention'], deficit: ['materials'] },
    alignment: 95
  },
  {
    id: 'theta',
    name: 'Theta',
    domain: 'Education & Knowledge Access',
    position: { x: 330, y: 290 }, // Bottom-center-left
    status: 'processing',
    resources: { surplus: ['knowledge', 'analysis'], deficit: ['time'] },
    alignment: 92
  },
  {
    id: 'iota',
    name: 'Iota',
    domain: 'Resource Management & Allocation',
    position: { x: 470, y: 280 }, // Right-bottom - better spacing
    status: 'active',
    resources: { surplus: ['inventory', 'data'], deficit: ['distribution'] },
    alignment: 90
  },
  {
    id: 'kappa',
    name: 'Kappa',
    domain: 'Culture, Ethics & Governance',
    position: { x: 390, y: 310 }, // Bottom center - well spaced
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

// Dynamic conversation patterns for random agent communications
const CONVERSATION_TEMPLATES = [
  { type: 'energy', messages: ['Solar array status', 'Power allocation', 'Grid optimization', 'Energy transfer'] },
  { type: 'material', messages: ['Resource delivery', 'Material analysis', 'Supply coordination', 'Inventory update'] },
  { type: 'data', messages: ['Data analysis', 'Information sync', 'Model update', 'Status report'] },
  { type: 'time', messages: ['Schedule sync', 'Task coordination', 'Timeline update', 'Process timing'] }
] as const;

const getRandomConversation = () => {
  const agentIds = AGENTS.map(a => a.id);
  const fromAgent = agentIds[Math.floor(Math.random() * agentIds.length)];
  let toAgent = agentIds[Math.floor(Math.random() * agentIds.length)];
  
  // Ensure different agents
  while (toAgent === fromAgent) {
    toAgent = agentIds[Math.floor(Math.random() * agentIds.length)];
  }
  
  const template = CONVERSATION_TEMPLATES[Math.floor(Math.random() * CONVERSATION_TEMPLATES.length)];
  const message = template.messages[Math.floor(Math.random() * template.messages.length)];
  
  return {
    from: fromAgent,
    to: toAgent,
    type: template.type,
    message
  };
};

const ARCHIVE_DECISIONS = [
  { id: 1, title: 'Solar Array Recalibration', status: 'IMPLEMENTED', timestamp: '14:18:23', impact: '+18% efficiency' },
  { id: 2, title: 'Biodiversity Restoration Phase 3', status: 'APPROVED', timestamp: '14:15:07', impact: '+12% ecosystem health' },
  { id: 3, title: 'Transport Network Optimization', status: 'IMPLEMENTED', timestamp: '14:12:45', impact: 'Zero emissions achieved' },
  { id: 4, title: 'Agricultural Yield Enhancement', status: 'APPROVED', timestamp: '14:09:33', impact: '+18% food production' },
  { id: 5, title: 'Healthcare System Upgrade', status: 'IMPLEMENTED', timestamp: '14:06:12', impact: '97.3% diagnostic accuracy' }
];

const SVGAgentNode = ({ agent, isSelected, onClick }: { agent: Agent; isSelected: boolean; onClick: () => void }) => {
  // Color coding based on agent type matching example image
  const agentColors = {
    alpha: '#22c55e',    // Infrastructure - Green
    beta: '#eab308',     // Energy - Yellow
    gamma: '#22c55e',    // Agriculture - Green
    delta: '#6b7280',    // Ecology - Gray
    epsilon: '#22c55e',  // Social - Green
    zeta: '#eab308',     // Transportation - Yellow
    eta: '#22c55e',      // Health - Green
    theta: '#eab308',    // Education - Yellow
    iota: '#22c55e',     // Resources - Green
    kappa: '#22c55e'     // Governance - Green
  };

  return (
    <g>
      {/* Agent circle */}
      <motion.circle
        cx={agent.position.x}
        cy={agent.position.y}
        r="20"
        fill={agentColors[agent.id as keyof typeof agentColors]}
        stroke={isSelected ? '#a3e635' : '#ffffff'}
        strokeWidth={isSelected ? '4' : '2'}
        className="cursor-pointer"
        onClick={onClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ delay: 0.1 }}
      />
      
      {/* Agent letter */}
      <text
        x={agent.position.x}
        y={agent.position.y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white font-bold text-sm pointer-events-none"
        style={{ fontSize: '14px' }}
      >
        {agent.name.charAt(0)}
      </text>
      
      {/* Agent name label */}
      <text
        x={agent.position.x}
        y={agent.position.y + 35}
        textAnchor="middle"
        className="fill-gray-600 text-xs font-medium pointer-events-none"
        style={{ fontSize: '12px' }}
      >
        {agent.name}
      </text>
      
      {/* Activity indicator for active agents */}
      {agent.status === 'active' && (
        <motion.circle
          cx={agent.position.x}
          cy={agent.position.y}
          r="20"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          opacity="0.5"
          animate={{ r: [20, 30, 20] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </g>
  );
};

const AnimatedConnectionLine = ({ 
  connection, 
  agents 
}: { 
  connection: ActiveConnection; 
  agents: Agent[]; 
}) => {
  const fromAgent = agents.find(a => a.id === connection.from);
  const toAgent = agents.find(a => a.id === connection.to);
  
  if (!fromAgent || !toAgent) return null;

  const colors = {
    energy: '#facc15',
    material: '#60a5fa',
    data: '#a78bfa',
    time: '#4ade80'
  };

  const icons = {
    energy: '⚡',
    material: '📦',
    data: '💾',
    time: '⏱️'
  };

  // Agent centers (40x40 nodes centered at position)
  const fromX = fromAgent.position.x;
  const fromY = fromAgent.position.y;
  const toX = toAgent.position.x;
  const toY = toAgent.position.y;

  // Calculate arrow direction
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowX = toX - 20 * Math.cos(angle);
  const arrowY = toY - 20 * Math.sin(angle);

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Connection line - color-coded by resource type */}
      <motion.line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={colors[connection.type]}
        strokeWidth="2"
        strokeOpacity="0.8"
        strokeDasharray={connection.type === 'data' || connection.type === 'time' ? "5,5" : "none"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      
      {/* Resource flow data like in example */}
      <motion.text
        x={(fromX + toX) / 2}
        y={(fromY + toY) / 2 - 8}
        textAnchor="middle"
        fontSize="12"
        fill={colors[connection.type]}
        className="font-mono font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {connection.type === 'energy' ? '1600kWh' : 
         connection.type === 'material' ? '24kg' :
         connection.type === 'data' ? '156MB' : '45min'}
      </motion.text>
      
      {/* Small moving dot along the line */}
      <motion.circle
        r="3"
        fill={colors[connection.type]}
        opacity="0.8"
      >
        <animateMotion
          dur="2s"
          repeatCount="1"
          path={`M ${fromX},${fromY} L ${toX},${toY}`}
          begin="0.3s"
        />
      </motion.circle>
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
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Dynamic connection system
  useEffect(() => {
    const createConnection = () => {
      const conversation = getRandomConversation();
      const newConnection: ActiveConnection = {
        id: `conn-${Date.now()}-${Math.random()}`,
        from: conversation.from,
        to: conversation.to,
        type: conversation.type,
        message: conversation.message,
        timestamp: Date.now()
      };

      setActiveConnections(prev => [...prev, newConnection]);

      // Remove connection after 3 seconds
      setTimeout(() => {
        setActiveConnections(prev => prev.filter(conn => conn.id !== newConnection.id));
      }, 3000);
    };

    // Create new connections every 2 seconds
    const connectionInterval = setInterval(createConnection, 2000);
    
    // Create initial connection
    createConnection();

    return () => clearInterval(connectionInterval);
  }, []);

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
              


              {/* Agent Network - everything in SVG for proper coordination */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                {/* Connection lines */}
                <AnimatePresence>
                  {activeConnections.map((connection) => (
                    <AnimatedConnectionLine 
                      key={connection.id} 
                      connection={connection} 
                      agents={AGENTS} 
                    />
                  ))}
                </AnimatePresence>
                
                {/* Agent nodes */}
                {AGENTS.map(agent => (
                  <SVGAgentNode
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgent?.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                  />
                ))}
              </svg>

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

                {/* Active Connections */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Live Communications</h3>
                  <div className="space-y-3">
                    {activeConnections.slice(-3).map((connection) => (
                      <div key={connection.id} className="bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-gray-600">
                            {connection.from.toUpperCase()} → {connection.to.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded text-white ${
                            connection.type === 'energy' ? 'bg-yellow-400' :
                            connection.type === 'material' ? 'bg-blue-400' :
                            connection.type === 'data' ? 'bg-purple-400' : 'bg-green-400'
                          }`}>
                            {connection.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-800 mt-1">{connection.message}</div>
                      </div>
                    ))}
                    {activeConnections.length === 0 && (
                      <div className="text-gray-500 text-xs">Establishing connections...</div>
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