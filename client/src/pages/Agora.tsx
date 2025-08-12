import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalConversation } from '@/contexts/GlobalConversationContext';

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
    resilience: number;
    equity: number;
    innovation: number;
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
    efficiency: 92,
    resilience: 88,
    equity: 90,
    innovation: 82
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
  { 
    id: 1, 
    title: 'Solar Array Recalibration', 
    status: 'IMPLEMENTED', 
    timestamp: '14:18:23', 
    impact: 'Ecological: +12 | Wellbeing: +5 | Efficiency: +18 | Resilience: +25 | Equity: +8 | Innovation: +15' 
  },
  { 
    id: 2, 
    title: 'Biodiversity Restoration Phase 3', 
    status: 'APPROVED', 
    timestamp: '14:15:07', 
    impact: 'Ecological: +20 | Wellbeing: +15 | Efficiency: +10 | Resilience: +22 | Equity: +18 | Innovation: +12' 
  },
  { 
    id: 3, 
    title: 'Transport Network Optimization', 
    status: 'IMPLEMENTED', 
    timestamp: '14:12:45', 
    impact: 'Ecological: +8 | Wellbeing: +12 | Efficiency: +25 | Resilience: +16 | Equity: +20 | Innovation: +18' 
  },
  { 
    id: 4, 
    title: 'Agricultural Yield Enhancement', 
    status: 'APPROVED', 
    timestamp: '14:09:33', 
    impact: 'Ecological: +18 | Wellbeing: +20 | Efficiency: +14 | Resilience: +15 | Equity: +25 | Innovation: +10' 
  },
  { 
    id: 5, 
    title: 'Healthcare System Upgrade', 
    status: 'IMPLEMENTED', 
    timestamp: '14:06:12', 
    impact: 'Ecological: +5 | Wellbeing: +28 | Efficiency: +12 | Resilience: +20 | Equity: +22 | Innovation: +16' 
  },
  { 
    id: 6, 
    title: 'Educational AI Ethics Framework', 
    status: 'DEBATING', 
    timestamp: '14:03:51', 
    impact: 'Ecological: +3 | Wellbeing: +18 | Efficiency: +8 | Resilience: +12 | Equity: +30 | Innovation: +25' 
  },
  { 
    id: 7, 
    title: 'Resource Recovery Automation Protocol', 
    status: 'VOTING', 
    timestamp: '14:00:37', 
    impact: 'Ecological: +25 | Wellbeing: +8 | Efficiency: +22 | Resilience: +18 | Equity: +10 | Innovation: +20' 
  }
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
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Minimal sci-fi filters */}
      <defs>
        <filter id={`softGlow-${connection.type}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="softBlur"/>
          <feGaussianBlur stdDeviation="6" result="outerGlow"/>
          <feMerge>
            <feMergeNode in="outerGlow"/>
            <feMergeNode in="softBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <linearGradient id={`neonGradient-${connection.type}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3"/>
          <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.8"/>
          <stop offset="70%" stopColor="#06b6d4" stopOpacity="1"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6"/>
        </linearGradient>

        <linearGradient id={`shimmer-${connection.type}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="45%" stopColor="transparent"/>
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4"/>
          <stop offset="55%" stopColor="transparent"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
      </defs>
      
      {/* Ultra-thin main connection line */}
      <motion.line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={`url(#neonGradient-${connection.type})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter={`url(#softGlow-${connection.type})`}
        opacity="0.9"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: 1,
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          pathLength: { duration: 2, ease: "easeOut" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Subtle shimmer effect */}
      <motion.line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={`url(#shimmer-${connection.type})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
      >
        <animate
          attributeName="stroke-dasharray"
          values="0,100;10,90;0,100"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="0;100"
          dur="3s"
          repeatCount="indefinite"
        />
      </motion.line>
      
      {/* Minimal flowing particle */}
      <motion.circle
        r="1.5"
        fill="#06b6d4"
        filter={`url(#softGlow-${connection.type})`}
        opacity="0.8"
        animate={{
          fill: ["#06b6d4", "#8b5cf6", "#0ea5e9", "#06b6d4"]
        }}
        transition={{
          fill: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path={`M ${fromX},${fromY} L ${toX},${toY}`}
          begin="1s"
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
  // Use global connections but allow local display state
  const [localActiveConnections, setLocalActiveConnections] = useState<ActiveConnection[]>([]);
  // Use global conversation state instead of local state
  const { chatMessages, activeConnections: globalActiveConnections, isLoadingNewMessage } = useGlobalConversation();
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Real-time impact metrics from SSE
  const [impactMetrics, setImpactMetrics] = useState({
    ecological: 78,
    wellbeing: 82,
    efficiency: 74,
    resilience: 71,
    equity: 79,
    innovation: 76
  });

  // Archive state
  const [archiveEntries, setArchiveEntries] = useState<any[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[] | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedArchiveEntry, setSelectedArchiveEntry] = useState<any>(null);
  const [archiveSearchQuery, setArchiveSearchQuery] = useState('');

  // Agent chat state
  const [showAgentChat, setShowAgentChat] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{[agentId: string]: {user: string; agent: string; timestamp: string}[]}>({});
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  
  // Local state for page-specific features
  const globalChatMessagesRef = useRef(chatMessages);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Sync local connections with global connections for AGORA visualization
  useEffect(() => {
    setLocalActiveConnections(globalActiveConnections);
  }, [globalActiveConnections]);

  // Keep refs in sync
  useEffect(() => {
    globalChatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  // Connect to impact metrics SSE stream
  useEffect(() => {
    const eventSource = new EventSource('/api/impact');
    
    eventSource.onmessage = (event) => {
      try {
        const metrics = JSON.parse(event.data);
        setImpactMetrics(metrics);
      } catch (error) {
        console.error('Error parsing impact metrics:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };
    
    return () => {
      eventSource.close();
    };
  }, []);

  // Send chat messages to impact analyzer
  useEffect(() => {
    const processLatestMessage = async () => {
      if (chatMessages.length === 0) return;
      
      const latestMessage = chatMessages[chatMessages.length - 1];
      if (!latestMessage.from || !latestMessage.message) return;
      
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent: latestMessage.from,
            text: latestMessage.message
          })
        });
      } catch (error) {
        console.error('Error sending message to impact analyzer:', error);
      }
    };
    
    processLatestMessage();
  }, [chatMessages]);

  // Fetch archive snapshots
  useEffect(() => {
    const fetchArchiveSnapshots = async () => {
      try {
        const response = await fetch('/api/archive/snapshots');
        if (response.ok) {
          const snapshots = await response.json();
          setArchiveEntries(snapshots);
        }
      } catch (error) {
        console.error('Error fetching archive snapshots:', error);
      }
    };

    if (viewMode === 'archive') {
      fetchArchiveSnapshots();
      // Refresh archive every 30 seconds
      const interval = setInterval(fetchArchiveSnapshots, 30000);
      return () => clearInterval(interval);
    }
  }, [viewMode]);

  // Handle archive entry click - now opens modal
  const handleArchiveEntryClick = async (entry: any) => {
    try {
      const response = await fetch(`/api/archive/transcript/${entry.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedArchiveEntry({
          ...entry,
          transcript: data.transcript
        });
        setShowArchiveModal(true);
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

  const sendMessageToAgent = async () => {
    if (!selectedAgent || !userMessage.trim() || isLoadingResponse) return;

    const messageToSend = userMessage.trim();
    const timestamp = new Date().toLocaleTimeString();

    setIsLoadingResponse(true);
    setUserMessage('');

    try {
      const response = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: selectedAgent,
          message: messageToSend,
          userId: 'user'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add to chat history
        setChatHistory(prev => ({
          ...prev,
          [selectedAgent]: [
            ...(prev[selectedAgent] || []),
            {
              user: messageToSend,
              agent: data.response,
              timestamp
            }
          ]
        }));
        
        // Auto-scroll to bottom after adding new message
        setTimeout(() => {
          if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          }
        }, 100);
      } else {
        console.error('Error from agent:', data.error);
        // Show error to user
        setChatHistory(prev => ({
          ...prev,
          [selectedAgent]: [
            ...(prev[selectedAgent] || []),
            {
              user: messageToSend,
              agent: `Error: ${data.error || 'Failed to get response from agent'}`,
              timestamp
            }
          ]
        }));
        
        // Auto-scroll to bottom after adding error message
        setTimeout(() => {
          if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message to agent:', error);
      setChatHistory(prev => ({
        ...prev,
        [selectedAgent]: [
          ...(prev[selectedAgent] || []),
          {
            user: messageToSend,
            agent: 'Error: Unable to connect to agent. Please try again.',
            timestamp
          }
        ]
      }));
      
      // Auto-scroll to bottom after adding error message
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  // Disable body scrolling but allow scrolling in specific containers
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    const preventScroll = (e: Event) => {
      // Allow scrolling in specific containers
      let target = e.target as Element;
      
      // Check if target exists and has classList property
      if (!target || !target.classList) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      while (target && target !== document.body && target.classList) {
        if (target.classList.contains('overflow-y-auto') || 
            target.classList.contains('scroll-smooth') ||
            target.id === 'chat-container') {
          return; // Allow scrolling in these containers
        }
        target = target.parentElement as Element;
      }
      
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      // Re-enable scrolling when leaving AGORA page
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      
      isComponentMounted.current = false;
    };
  }, []);

  return (
    <div className="bg-white text-black overflow-hidden relative" style={{ touchAction: 'none', height: '100vh', paddingTop: '64px' }}>
      
      {/* Header - AGORA title and controls - positioned right after navigation */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50/50 relative z-10">
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
              <button
                onClick={() => setShowAgentChat(true)}
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

      <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
        
        {viewMode === 'live' ? (
          <>
            {/* Live Decision Map */}
            <div className="w-2/3 relative bg-gray-50/30 border-r border-gray-200">
              


              {/* Agent Network - everything in SVG for proper coordination */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                {/* Connection lines */}
                <AnimatePresence>
                  {localActiveConnections.map((connection) => (
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
                  <div className="grid grid-cols-3 gap-3">
                    <MetricGauge label="Ecological" value={Math.round(impactMetrics.ecological)} color="text-green-500" />
                    <MetricGauge label="Wellbeing" value={Math.round(impactMetrics.wellbeing)} color="text-blue-500" />
                    <MetricGauge label="Efficiency" value={Math.round(impactMetrics.efficiency)} color="text-purple-500" />
                    <MetricGauge label="Resilience" value={Math.round(impactMetrics.resilience)} color="text-orange-500" />
                    <MetricGauge label="Equity" value={Math.round(impactMetrics.equity)} color="text-red-500" />
                    <MetricGauge label="Innovation" value={Math.round(impactMetrics.innovation)} color="text-cyan-500" />
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
          <div className="w-full bg-white text-gray-700 font-mono p-6 overflow-hidden border-l border-gray-200">
            <div className="mb-4">
              <div className="text-gray-800 text-xs font-semibold">DECISION ARCHIVE - VENUS PROJECT AGORA</div>
              <div className="text-xs text-gray-600">System Time: {currentTime} | Status: OPERATIONAL</div>
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations and decisions..."
                    value={archiveSearchQuery}
                    onChange={(e) => setArchiveSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
                {archiveSearchQuery && (
                  <div className="mt-1 text-xs text-gray-500">
                    Filtering results for "{archiveSearchQuery}"
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1 text-xs max-h-[calc(100vh-12rem)] overflow-y-auto">
              {(() => {
                // Filter archive entries based on search query
                const filteredEntries = archiveEntries.filter(entry => 
                  archiveSearchQuery === '' || 
                  entry.title.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
                  entry.status.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
                  entry.impact?.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
                  entry.participants?.toString().toLowerCase().includes(archiveSearchQuery.toLowerCase())
                );
                
                if (archiveEntries.length === 0) {
                  return (
                    <div className="text-gray-500 p-4 text-center">
                      No archive snapshots available yet.<br/>
                      Snapshots are created hourly based on agent conversations.
                    </div>
                  );
                }
                
                if (filteredEntries.length === 0 && archiveSearchQuery !== '') {
                  return (
                    <div className="text-gray-500 p-4 text-center">
                      No results found for "{archiveSearchQuery}".<br/>
                      Try different search terms or clear the search.
                    </div>
                  );
                }
                
                return filteredEntries.map((entry) => (
                  <div key={entry.id}>
                    <div 
                      className="hover:bg-gray-100 p-1 cursor-pointer rounded"
                      onClick={() => handleArchiveEntryClick(entry)}
                    >
                      <span className="text-lime-600 font-medium">[{entry.timestamp}]</span>
                      <span className="ml-2 text-gray-800">{entry.title}</span>
                      <span className="ml-4 text-blue-600">{entry.status}</span>
                      <span className="ml-4 text-gray-500">{entry.impact}</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              &gt; Use LIVE MAP mode to view active decision processes
              {archiveSearchQuery && (
                <div className="mt-1">
                  <button 
                    onClick={() => setArchiveSearchQuery('')}
                    className="text-lime-600 hover:text-lime-800 underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4"
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

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Archive Conversation Modal */}
      <AnimatePresence>
        {showArchiveModal && selectedArchiveEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowArchiveModal(false)}
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
                  <h2 className="text-xl font-semibold text-gray-800">{selectedArchiveEntry.title}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{selectedArchiveEntry.timestamp}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedArchiveEntry.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      selectedArchiveEntry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedArchiveEntry.status}
                    </span>
                    <span>{selectedArchiveEntry.participants} participants</span>
                    <span>{selectedArchiveEntry.messageCount} messages</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="h-full bg-gray-50 rounded-lg border overflow-hidden">
                  <div className="h-full overflow-y-auto p-4 space-y-3">
                    {selectedArchiveEntry.transcript ? (
                      selectedArchiveEntry.transcript.map((message: string, index: number) => {
                        // Parse message format like "[02:56:31] EPSILON to Kappa: message..."
                        const messageMatch = message.match(/^\[([^\]]+)\]\s+(\w+)\s+(.+?):\s+(.+)$/);
                        if (messageMatch) {
                          const [, timestamp, fromAgent, toInfo, messageText] = messageMatch;
                          const toAgent = toInfo.replace('to ', '');
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="bg-white rounded-lg p-4 shadow-sm border"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lime-400 to-green-500 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">{fromAgent.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-800">Agent {fromAgent}</div>
                                    <div className="text-xs text-gray-500">to {toAgent}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 font-mono">{timestamp}</div>
                              </div>
                              <div className="text-sm text-gray-700 leading-relaxed pl-11">
                                {messageText}
                              </div>
                            </motion.div>
                          );
                        }
                        
                        // Fallback for unparsed messages
                        return (
                          <div key={index} className="bg-white rounded-lg p-3 shadow-sm border text-sm text-gray-700 font-mono">
                            {message}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-gray-500 text-center py-16">
                        <div className="text-lg mb-2">Loading conversation...</div>
                        <div className="text-sm">Retrieving archived messages</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Archived conversation from decision process: {selectedArchiveEntry.id}
                  </div>
                  {selectedArchiveEntry.impact && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600">Ecological: {selectedArchiveEntry.impact.ecological || 'N/A'}</span>
                      <span className="text-blue-600">Wellbeing: {selectedArchiveEntry.impact.wellbeing || 'N/A'}</span>
                      <span className="text-purple-600">Efficiency: {selectedArchiveEntry.impact.efficiency || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Chat Modal */}
      {showAgentChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4"
          onClick={(e) => e.target === e.currentTarget && setShowAgentChat(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl border max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Agent Communication</h3>
                  <p className="text-sm text-gray-600">Select an agent to chat with</p>
                </div>
                <button
                  onClick={() => setShowAgentChat(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {!selectedAgent ? (
              /* Agent Selection */
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {AGENTS.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border text-left transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">Agent {agent.name}</h4>
                        <span className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-400' :
                          agent.status === 'processing' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{agent.domain}</p>
                      <p className="text-xs text-gray-500">Alignment: {agent.alignment}%</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Interface */
              <div className="flex flex-col h-[60vh]">
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedAgent(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ← Back
                      </button>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Agent {AGENTS.find(a => a.id === selectedAgent)?.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {AGENTS.find(a => a.id === selectedAgent)?.domain}
                        </p>
                      </div>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${
                      AGENTS.find(a => a.id === selectedAgent)?.status === 'active' ? 'bg-green-400' :
                      AGENTS.find(a => a.id === selectedAgent)?.status === 'processing' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div 
                  ref={chatMessagesRef}
                  className="flex-1 p-4 overflow-y-auto bg-gray-50"
                >
                  <div className="space-y-3">
                    {/* System message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        You are now connected to Agent {AGENTS.find(a => a.id === selectedAgent)?.name}.
                        This agent specializes in {AGENTS.find(a => a.id === selectedAgent)?.domain.toLowerCase()}.
                        How can I assist you with decision analysis and resource coordination?
                      </p>
                    </div>

                    {/* Chat History */}
                    {selectedAgent && chatHistory[selectedAgent]?.map((entry, index) => (
                      <div key={index} className="space-y-2">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-lime-500 text-white rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">{entry.user}</p>
                            <p className="text-xs opacity-75 mt-1">{entry.timestamp}</p>
                          </div>
                        </div>
                        {/* Agent Response */}
                        <div className="flex justify-start">
                          <div className="bg-white border rounded-lg p-3 max-w-[80%]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              <span className="text-xs font-medium text-gray-600">
                                Agent {AGENTS.find(a => a.id === selectedAgent)?.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{entry.agent}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoadingResponse && (
                      <div className="flex justify-start">
                        <div className="bg-white border rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <span className="text-xs text-gray-500">Agent is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder={`Message Agent ${AGENTS.find(a => a.id === selectedAgent)?.name}...`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userMessage.trim() && !isLoadingResponse) {
                          sendMessageToAgent();
                        }
                      }}
                    />
                    <button
                      onClick={sendMessageToAgent}
                      disabled={!userMessage.trim() || isLoadingResponse}
                      className="px-4 py-2 bg-lime-500 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-600 transition-colors"
                    >
                      {isLoadingResponse ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}