import { useState, useEffect, useRef, useCallback } from 'react';
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
    position: { x: 150, y: 40 }, // Far left - moved up 4cm
    status: 'active',
    resources: { surplus: ['titanium', 'concrete'], deficit: ['energy'] },
    alignment: 94
  },
  {
    id: 'beta',
    name: 'Beta',
    domain: 'Energy Systems',
    position: { x: 300, y: 30 }, // Top center - spread higher
    status: 'processing',
    resources: { surplus: ['solar', 'wind'], deficit: ['materials'] },
    alignment: 96
  },
  {
    id: 'gamma',
    name: 'Gamma',
    domain: 'Food & Agriculture',
    position: { x: 430, y: 30 }, // Moved up 7cm total from red X position
    status: 'active',
    resources: { surplus: ['biomass', 'nutrients'], deficit: ['water'] },
    alignment: 91
  },
  {
    id: 'delta',
    name: 'Delta',
    domain: 'Ecology & Environmental Restoration',
    position: { x: 120, y: 140 }, // Far left-center - more spread
    status: 'idle',
    resources: { surplus: ['biodiversity'], deficit: ['time'] },
    alignment: 89
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    domain: 'Social Dynamics & Wellbeing',
    position: { x: 480, y: 100 }, // Far right-center - more spread
    status: 'active',
    resources: { surplus: ['culture', 'knowledge'], deficit: ['infrastructure'] },
    alignment: 93
  },
  {
    id: 'zeta',
    name: 'Zeta',
    domain: 'Transportation & Mobility',
    position: { x: 520, y: 180 }, // Far right-lower - spread wider
    status: 'processing',
    resources: { surplus: ['efficiency', 'networks'], deficit: ['energy'] },
    alignment: 88
  },
  {
    id: 'eta',
    name: 'Eta',
    domain: 'Health & Medical Systems',
    position: { x: 80, y: 220 }, // Far left-bottom - spread wider
    status: 'active',
    resources: { surplus: ['diagnostics', 'prevention'], deficit: ['materials'] },
    alignment: 95
  },
  {
    id: 'theta',
    name: 'Theta',
    domain: 'Education & Knowledge Access',
    position: { x: 220, y: 250 }, // Left-bottom - spread wider
    status: 'processing',
    resources: { surplus: ['knowledge', 'analysis'], deficit: ['time'] },
    alignment: 92
  },
  {
    id: 'iota',
    name: 'Iota',
    domain: 'Resource Management & Allocation',
    position: { x: 480, y: 260 }, // Right-bottom - moved down
    status: 'active',
    resources: { surplus: ['inventory', 'data'], deficit: ['distribution'] },
    alignment: 90
  },
  {
    id: 'kappa',
    name: 'Kappa',
    domain: 'Culture, Ethics & Governance',
    position: { x: 350, y: 270 }, // Bottom center - spread lower
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

// Enhanced conversation templates reflecting specialized agent roles
const CONVERSATION_TEMPLATES = [
  { 
    type: 'energy', 
    messages: [
      'Proposing dynamic grid reallocation to support vertical farming expansion',
      'Solar array efficiency peaked at 94% - surplus available for industrial processes',
      'Wind patterns suggest 18% increase in turbine output next quarter',
      'Requesting priority energy allocation for emergency medical systems',
      'Thermal storage optimization could reduce peak load by 23%',
      'Energy export potential to neighboring districts exceeds current capacity'
    ] 
  },
  { 
    type: 'material', 
    messages: [
      'Prefab modules ready for habitat deployment - coordinating with Infrastructure',
      'Circular economy protocols show 67% material recovery rate this cycle',
      'Biocomposite materials testing shows 15% stronger durability than concrete',
      'Critical shortage of rare earth elements detected - seeking alternatives',
      'Modular housing units can be reconfigured for seasonal population changes',
      'Material flow analysis indicates waste reduction opportunity in construction'
    ] 
  },
  { 
    type: 'data', 
    messages: [
      'Biodiversity index shows positive trend in rewilded zones - sharing with Ecology',
      'AI diagnostic accuracy improved to 97.8% with latest health data integration',
      'Cultural participation metrics indicate need for expanded arts infrastructure',
      'Transportation flow models predict 12% efficiency gain with new routing',
      'Educational outcome data suggests curriculum adjustment for emerging tech skills',
      'Social harmony indicators show strong correlation with green space access'
    ] 
  },
  { 
    type: 'time', 
    messages: [
      'Climate adaptation window narrowing - accelerating restoration timeline',
      'Food security projections require immediate agricultural diversification',
      'Infrastructure resilience upgrade must complete before storm season',
      'Cultural preservation digitization project needs priority scheduling',
      'Medical AI training requires 72-hour uninterrupted compute allocation',
      'Educational re-skilling programs must launch within 30 days for maximum impact'
    ] 
  }
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

const SVGAgentNode = ({ agent, isHovered, onMouseEnter, onMouseLeave }: { agent: Agent; isHovered: boolean; onMouseEnter: () => void; onMouseLeave: () => void }) => {
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
        stroke={isHovered ? '#a3e635' : '#ffffff'}
        strokeWidth={isHovered ? '4' : '2'}
        className="cursor-pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);
  const [viewMode, setViewMode] = useState<'live' | 'archive'>('live');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    timestamp: string;
    from: string;
    to: string;
    message: string;
    type: 'energy' | 'material' | 'data' | 'time';
  }>>([]);
  const [isLoadingNewMessage, setIsLoadingNewMessage] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Use refs to prevent re-renders and maintain stable state
  const chatMessagesRef = useRef(chatMessages);
  const isComponentMounted = useRef(true);
  const conversationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Stable state management - prevent re-renders during scroll
  useEffect(() => {
    // Keep refs in sync but don't trigger re-renders
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  // Disable all scrolling on this page
  useEffect(() => {
    // Disable scrolling on the page
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Prevent scroll events
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      // Re-enable scrolling when leaving the page
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      
      isComponentMounted.current = false;
      if (conversationIntervalRef.current) {
        clearInterval(conversationIntervalRef.current);
      }
    };
  }, []);

  // Stable conversation creation - no dependencies to prevent re-renders
  const createGrokConversation = async () => {
    if (!isComponentMounted.current) return;
    
    try {
      setIsLoadingNewMessage(true);
      
      const response = await fetch('/api/agent-conversation');
      if (!response.ok) throw new Error('Failed to fetch conversation');
      const conversation = await response.json();
      
      if (!isComponentMounted.current) return;

      const newConnection: ActiveConnection = {
        id: `conn-${Date.now()}-${Math.random()}`,
        from: conversation.from,
        to: conversation.to,
        type: conversation.type,
        message: conversation.message,
        timestamp: Date.now()
      };

      // Update connections without dependencies
      setActiveConnections(prev => {
        const filtered = prev.filter(conn => Date.now() - conn.timestamp < 4000);
        return [...filtered, newConnection];
      });

      // Add new message without triggering scroll
      const chatMessage = {
        id: newConnection.id,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        from: newConnection.from.toUpperCase(),
        to: newConnection.to.toUpperCase(),
        message: newConnection.message,
        type: newConnection.type
      };

      setChatMessages(current => {
        // Check for duplicates using current state
        if (current.some(msg => msg.id === chatMessage.id)) {
          return current;
        }
        
        // Maintain stable message history
        const updated = [...current.slice(-19), chatMessage];
        return updated;
      });

    } catch (error) {
      console.error('Grok conversation failed:', error);
      
      if (!isComponentMounted.current) return;
      
      // Fallback without dependencies
      const fallback = getRandomConversation();
      const fallbackMessage = {
        id: `fallback-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        from: fallback.from.toUpperCase(),
        to: fallback.to.toUpperCase(),
        message: fallback.message,
        type: fallback.type
      };

      setChatMessages(current => [...current.slice(-19), fallbackMessage]);
    } finally {
      if (isComponentMounted.current) {
        setIsLoadingNewMessage(false);
      }
    }
  };

  // Initialize conversations only once
  useEffect(() => {
    let mounted = true;
    
    // Start conversations after component is stable
    const startConversations = async () => {
      if (!mounted) return;
      
      // Initial conversation
      await createGrokConversation();
      
      if (!mounted) return;
      
      // Set up interval for new conversations
      conversationIntervalRef.current = setInterval(() => {
        if (mounted && isComponentMounted.current) {
          createGrokConversation();
        }
      }, 12000); // 12 seconds for stability
    };

    const timer = setTimeout(startConversations, 1500);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (conversationIntervalRef.current) {
        clearInterval(conversationIntervalRef.current);
      }
    };
  }, []); // Empty dependency array - run only once

  return (
    <div className="h-screen bg-white text-black pt-20 overflow-hidden" style={{ touchAction: 'none' }}>
      
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

      <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
        
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
                    isHovered={hoveredAgent?.id === agent.id}
                    onMouseEnter={() => setHoveredAgent(agent)}
                    onMouseLeave={() => setHoveredAgent(null)}
                  />
                ))}
              </svg>

              {/* Agent Detail Panel */}
              <AnimatePresence>
                {hoveredAgent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute bg-white rounded-lg shadow-xl border p-4 w-64 z-10 pointer-events-none"
                    style={{
                      left: `${Math.min(Math.max((hoveredAgent.position.x / 600) * 100 + 5, 2), 55)}%`,
                      top: `${Math.min(Math.max((hoveredAgent.position.y / 400) * 100 - 20, 2), 75)}%`,
                      transformOrigin: 'center'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Agent {hoveredAgent.name}</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-gray-500">Domain:</span>
                        <span className="ml-2 font-mono">{hoveredAgent.domain}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Alignment:</span>
                        <span className="ml-2 font-mono">{hoveredAgent.alignment}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Surplus:</span>
                        <div className="ml-2 text-green-600">{hoveredAgent.resources.surplus.join(', ')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Needs:</span>
                        <div className="ml-2 text-red-600">{hoveredAgent.resources.deficit.join(', ')}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Decision Metrics Panel */}
            <div className="w-1/3 bg-white p-6 flex flex-col">
              <div className="space-y-6 flex-shrink-0">
                
                {/* Current Decision Metrics */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Decision Impact Analysis</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <MetricGauge label="Ecological" value={CURRENT_DECISION.impact.ecological} color="text-green-500" />
                    <MetricGauge label="Wellbeing" value={CURRENT_DECISION.impact.wellbeing} color="text-blue-500" />
                    <MetricGauge label="Efficiency" value={CURRENT_DECISION.impact.efficiency} color="text-purple-500" />
                  </div>
                </div>

                {/* Live Communications Chat */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-800">Live Communications</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isLoadingNewMessage ? 'bg-blue-400 animate-spin' : 'bg-green-400 animate-pulse'}`}></div>
                      <span className="text-xs text-gray-500">{isLoadingNewMessage ? 'Generating...' : 'Live'}</span>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-gray-50 rounded-lg border flex-1 overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setShowChatModal(true)}
                  >
                    <div className="h-64 overflow-y-auto p-3 space-y-2 scroll-smooth" id="chat-container">
                      {chatMessages.length === 0 && (
                        <div className="text-gray-500 text-xs text-center py-8">
                          Waiting for agent communications...
                        </div>
                      )}
                      {chatMessages.slice(-5).map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded p-2 shadow-sm border hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-gray-600">
                                {message.from} → {message.to}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-xs text-white ${
                                message.type === 'energy' ? 'bg-yellow-400' :
                                message.type === 'material' ? 'bg-blue-400' :
                                message.type === 'data' ? 'bg-purple-400' : 'bg-green-400'
                              }`}>
                                {message.type}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">{message.timestamp}</span>
                          </div>
                          <div className="text-xs text-gray-800 leading-relaxed">
                            {message.message}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {chatMessages.length} messages • Click to expand full conversation
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
          <div className="w-full bg-black text-green-400 font-mono p-6 overflow-hidden">
            <div className="mb-4">
              <div className="text-yellow-400 text-xs">DECISION ARCHIVE - VENUS PROJECT AGORA</div>
              <div className="text-xs">System Time: {currentTime} | Status: OPERATIONAL</div>
              <div className="border-t border-green-800 my-2"></div>
            </div>
            
            <div className="space-y-1 text-xs max-h-[calc(100vh-10rem)] overflow-hidden">
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

      {/* Live Communications Modal */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Agent Communications - The Bigger Picture</h2>
                  <p className="text-sm text-gray-500 mt-1">Real-time conversations between AI agents in The Venus Project</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isLoadingNewMessage ? 'bg-blue-400 animate-spin' : 'bg-green-400 animate-pulse'}`}></div>
                    <span className="text-sm text-gray-600">{isLoadingNewMessage ? 'Generating...' : 'Live'}</span>
                    <span className="text-sm text-gray-500">• {chatMessages.length} messages</span>
                  </div>
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="h-full bg-gray-50 rounded-lg border overflow-hidden">
                  <div className="h-full overflow-y-auto p-4 space-y-3" id="modal-chat-container">
                    {chatMessages.length === 0 && (
                      <div className="text-gray-500 text-center py-16">
                        <div className="text-lg mb-2">Waiting for agent communications...</div>
                        <div className="text-sm">AI agents are preparing to share their insights</div>
                      </div>
                    )}
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lime-400 to-green-500 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{message.from.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-800">{message.from}</div>
                                <div className="text-xs text-gray-500">to {message.to}</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                              message.type === 'energy' ? 'bg-yellow-400' :
                              message.type === 'material' ? 'bg-blue-400' :
                              message.type === 'data' ? 'bg-purple-400' : 'bg-green-400'
                            }`}>
                              {message.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 font-mono">{message.timestamp}</div>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed pl-11">
                          {message.message}
                        </div>
                        <div className="flex items-center gap-4 mt-3 pl-11">
                          <div className="text-xs text-gray-400">
                            Agent-to-Agent Communication
                          </div>
                          <div className="text-xs text-gray-400">
                            Priority: {message.type === 'time' ? 'High' : message.type === 'energy' ? 'Critical' : 'Normal'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="text-center text-xs text-gray-500">
                  These conversations are generated in real-time by Grok AI, representing authentic coordination between specialized city management agents
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}