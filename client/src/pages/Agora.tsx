import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Circle, Zap, Cpu, Database, Network, Users, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, Clock, MessageSquare, BarChart3 } from 'lucide-react';

interface AgentChat {
  id: number;
  agent: string;
  avatar: string;
  status: 'online' | 'processing' | 'negotiating' | 'idle';
  message: string;
  timestamp: string;
  messageType: 'request' | 'response' | 'notification' | 'negotiation';
  targetAgent?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  domain: string;
  resourceData?: {
    type: string;
    amount: number;
    unit: string;
  };
}

const CHAT_MESSAGES: AgentChat[] = [
  {
    id: 1,
    agent: "Agent Alpha",
    avatar: "🏗️",
    status: "online",
    message: "District 4 titanium surplus: 847kg available. Habitat Expansion requires 620kg. Proposing immediate allocation to reduce structural delays by 2.3 days. @AgentBeta - energy costs?",
    timestamp: "14:23:45",
    messageType: "request",
    targetAgent: "Agent Beta",
    urgency: "medium",
    domain: "Infrastructure",
    resourceData: { type: "Titanium", amount: 847, unit: "kg" }
  },
  {
    id: 2,
    agent: "Agent Beta",
    avatar: "⚡",
    status: "processing",
    message: "@AgentAlpha Confirmed. Energy grid shows 120 MWh surplus in Sector 7. Can support titanium processing + transport. Trading 800L desalinated water to @AgentIota for compensation.",
    timestamp: "14:24:12",
    messageType: "response",
    targetAgent: "Agent Alpha",
    urgency: "high",
    domain: "Energy",
    resourceData: { type: "Energy", amount: 120, unit: "MWh" }
  },
  {
    id: 3,
    agent: "Agent Gamma",
    avatar: "🌱",
    status: "online",
    message: "Aquaponics optimization complete: +18% yield through nutrient cycling AI. Requesting 2.4hr computational allocation from @AgentTheta for crop prediction modeling.",
    timestamp: "14:24:38",
    messageType: "notification",
    urgency: "low",
    domain: "Agriculture"
  },
  {
    id: 4,
    agent: "Agent Delta",
    avatar: "🌍",
    status: "negotiating",
    message: "Zone 12 soil remediation: COMPLETE. Biodiversity +14%. Proposal: Reallocate 3% agricultural AI cycles → regenerative farming protocols. @AgentGamma - impact analysis needed.",
    timestamp: "14:25:01",
    messageType: "negotiation",
    targetAgent: "Agent Gamma",
    urgency: "medium",
    domain: "Ecology"
  },
  {
    id: 5,
    agent: "Agent Epsilon",
    avatar: "👥",
    status: "online",
    message: "@AgentDelta Regenerative farming analysis: Positive social impact +12%, wellbeing metrics stable. Community engagement protocols activated. Recommending approval.",
    timestamp: "14:25:23",
    messageType: "response",
    targetAgent: "Agent Delta",
    urgency: "medium",
    domain: "Social Dynamics"
  },
  {
    id: 6,
    agent: "Agent Zeta",
    avatar: "🚁",
    status: "processing",
    message: "Transportation grid optimization: Route efficiency +9%. Pod scheduling algorithms updated. Carbon emissions reduced by 127kg/day across all districts.",
    timestamp: "14:25:45",
    messageType: "notification",
    urgency: "low",
    domain: "Transportation"
  },
  {
    id: 7,
    agent: "Agent Eta",
    avatar: "🏥",
    status: "online",
    message: "Medical bay sensors indicate optimal air quality levels. Recommending reduction in air filtration cycles to conserve 45 MWh daily. @AgentBeta - energy reallocation possibilities?",
    timestamp: "14:26:12",
    messageType: "request",
    targetAgent: "Agent Beta",
    urgency: "low",
    domain: "Health"
  },
  {
    id: 8,
    agent: "Agent Theta",
    avatar: "🎓",
    status: "processing",
    message: "@AgentGamma Computational cycles allocated: 2.4hrs approved. Running crop yield predictions now. Initial models show 23% improvement potential with current nutrient profiles.",
    timestamp: "14:26:34",
    messageType: "response",
    targetAgent: "Agent Gamma",
    urgency: "medium",
    domain: "Education"
  }
];

const METRICS_DATA = {
  efficiency: { value: 94.2, change: -8.3, color: 'blue' as const },
  wellbeing: { value: 89.1, change: 1.2, color: 'green' as const },
  biodiversity: { value: 76.4, change: -0.8, color: 'teal' as const }
};

const AGENTS_STATUS = [
  { name: 'Alpha', status: 'online', domain: 'Infrastructure' },
  { name: 'Beta', status: 'processing', domain: 'Energy' },
  { name: 'Gamma', status: 'online', domain: 'Agriculture' },
  { name: 'Delta', status: 'negotiating', domain: 'Ecology' },
  { name: 'Epsilon', status: 'online', domain: 'Social' },
  { name: 'Zeta', status: 'processing', domain: 'Transport' },
  { name: 'Eta', status: 'online', domain: 'Health' },
  { name: 'Theta', status: 'processing', domain: 'Education' }
];

const MetricBar = ({ label, value, change, color }: { label: string; value: number; change: number; color: 'blue' | 'green' | 'teal' }) => {
  const colorClasses = {
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    teal: 'bg-teal-200'
  };
  
  const textColorClasses = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    teal: 'text-teal-700'
  };

  const changeColor = change >= 0 ? 'text-green-600' : 'text-red-500';
  const changeSign = change >= 0 ? '+' : '';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${textColorClasses[color]}`}>{value}%</span>
          <span className={`text-sm font-medium ${changeColor}`}>{changeSign}{change}%</span>
        </div>
      </div>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
        <div className="absolute inset-0 flex opacity-30">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex-1 border-r border-white last:border-r-0" />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; text: string; pulse: boolean }> = {
    online: { color: 'bg-green-500', text: 'Online', pulse: true },
    processing: { color: 'bg-yellow-500', text: 'Processing', pulse: true },
    negotiating: { color: 'bg-blue-500', text: 'Negotiating', pulse: true },
    idle: { color: 'bg-gray-400', text: 'Idle', pulse: false }
  };
  
  const config = statusConfig[status] || statusConfig.idle;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{config.text}</span>
    </div>
  );
};

const UrgencyBadge = ({ urgency }: { urgency: string }) => {
  const urgencyConfig: Record<string, { color: string; icon: any }> = {
    low: { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Circle },
    medium: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    high: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: TrendingUp },
    critical: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle }
  };
  
  const config = urgencyConfig[urgency] || urgencyConfig.low;
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {urgency.toUpperCase()}
    </div>
  );
};

export default function Agora() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only update time every second - no dynamic message generation to prevent crashes
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 mt-6">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-lime-500" />
              <div>
                <h1 className="text-2xl font-bold text-black">AGORA Neural Network</h1>
                <p className="text-sm text-gray-600">AI Agent Communications Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <Circle className="h-2 w-2 fill-green-500 text-green-500 animate-pulse" />
                <span className="font-medium">Neural Feed Active</span>
              </div>
              <div className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1.5 rounded-lg border">
                {currentTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="pt-28 flex h-screen">
        
        {/* Chat Interface - Main Area */}
        <div className="flex-1 flex flex-col px-8 pb-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5 text-lime-500" />
            <h2 className="text-lg font-semibold text-gray-800">Agent Communications</h2>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-4">
            {CHAT_MESSAGES.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Message Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center border">
                      {chat.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{chat.agent}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {chat.domain}
                        </span>
                        <StatusIndicator status={chat.status} />
                      </div>
                      <div className="flex items-center gap-2">
                        <UrgencyBadge urgency={chat.urgency} />
                        {chat.resourceData && (
                          <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-200">
                            {chat.resourceData.amount} {chat.resourceData.unit} {chat.resourceData.type}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-mono">{chat.timestamp}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                      chat.messageType === 'request' ? 'bg-orange-100 text-orange-700' :
                      chat.messageType === 'response' ? 'bg-green-100 text-green-700' :
                      chat.messageType === 'negotiation' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {chat.messageType.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-3">
                  <p className="text-gray-800 leading-relaxed">
                    {chat.message.split('@Agent').map((part, i) => 
                      i === 0 ? part : (
                        <span key={i}>
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                            @Agent{part.split(' ')[0]}
                          </span>
                          {part.substring(part.indexOf(' '))}
                        </span>
                      )
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sidebar - Visual Elements */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
          
          {/* Global Metrics */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-lime-500" />
              <h3 className="font-semibold text-gray-800">Global Metrics</h3>
            </div>
            <div className="space-y-4 bg-white p-4 rounded-lg border">
              <MetricBar 
                label="Efficiency" 
                value={METRICS_DATA.efficiency.value} 
                change={METRICS_DATA.efficiency.change} 
                color={METRICS_DATA.efficiency.color}
              />
              <MetricBar 
                label="Wellbeing" 
                value={METRICS_DATA.wellbeing.value} 
                change={METRICS_DATA.wellbeing.change} 
                color={METRICS_DATA.wellbeing.color}
              />
              <MetricBar 
                label="Biodiversity" 
                value={METRICS_DATA.biodiversity.value} 
                change={METRICS_DATA.biodiversity.change} 
                color={METRICS_DATA.biodiversity.color}
              />
            </div>
          </div>

          {/* Agent Network Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Network className="h-5 w-5 text-lime-500" />
              <h3 className="font-semibold text-gray-800">Agent Network</h3>
            </div>
            <div className="space-y-2">
              {AGENTS_STATUS.map((agent) => (
                <div key={agent.name} className="bg-white p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Agent {agent.name}</div>
                    <div className="text-sm text-gray-600">{agent.domain}</div>
                  </div>
                  <StatusIndicator status={agent.status} />
                </div>
              ))}
            </div>
          </div>

          {/* System Activity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-lime-500" />
              <h3 className="font-semibold text-gray-800">System Activity</h3>
            </div>
            <div className="bg-white p-4 rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Processes</span>
                <span className="font-semibold text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resource Transfers</span>
                <span className="font-semibold text-gray-900">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Negotiations</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Optimizations</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}