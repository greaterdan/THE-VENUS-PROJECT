import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, Leaf, TrendingUp, Users, Zap, ArrowRight, Circle, Home, BarChart3, Cpu, Brain } from 'lucide-react';

interface AgentMessage {
  id: number;
  agent: string;
  domain: string;
  content: string;
  timestamp: string;
  status: 'online' | 'processing' | 'idle';
  efficiency: number;
  wellbeing: number;
  biodiversity: number;
  efficiencyChange: number;
  wellbeingChange: number;
  biodiversityChange: number;
  color: string;
  statusColor: string;
}

const AGENT_MESSAGES: AgentMessage[] = [
  {
    id: 1,
    agent: "Agent Alpha",
    domain: "Infrastructure",
    content: "Surplus titanium from District 4 allocated to Habitat Expansion, reducing projected structural delays by 2.3 days.",
    timestamp: "14:23:45",
    status: "online",
    efficiency: 94.2,
    wellbeing: 89.1,
    biodiversity: 76.4,
    efficiencyChange: -8.3,
    wellbeingChange: 1.2,
    biodiversityChange: -0.8,
    color: "bg-green-100 border-green-200",
    statusColor: "bg-green-500"
  },
  {
    id: 2,
    agent: "Agent Beta",
    domain: "Energy", 
    content: "Transferred 120 MWh to Iota for vertical farm lighting in exchange for 800 liters desalinated water surplus.",
    timestamp: "14:24:12",
    status: "processing",
    efficiency: 98.7,
    wellbeing: 91.3,
    biodiversity: 82.9,
    efficiencyChange: 12.1,
    wellbeingChange: 1.2,
    biodiversityChange: -0.8,
    color: "bg-yellow-100 border-yellow-200",
    statusColor: "bg-red-500"
  },
  {
    id: 3,
    agent: "Agent Gamma",
    domain: "Agriculture",
    content: "Aquaponics yield increased 18% through optimal nutrient cycling. Requesting 2.4 hours computational time from Theta for crop optimization.",
    timestamp: "14:24:38",
    status: "online",
    efficiency: 91.5,
    wellbeing: 88.7,
    biodiversity: 94.2,
    efficiencyChange: 18.0,
    wellbeingChange: 1.2,
    biodiversityChange: -0.8,
    color: "bg-green-100 border-green-200", 
    statusColor: "bg-green-500"
  },
  {
    id: 4,
    agent: "Agent Delta",
    domain: "Ecology",
    content: "Soil remediation complete in Zone 12. Biodiversity index increased by 14%. Proposal: shift 3% of agricultural AI cycles to regenerative farming.",
    timestamp: "14:25:01",
    status: "idle",
    efficiency: 87.3,
    wellbeing: 85.9,
    biodiversity: 97.1,
    efficiencyChange: 5.7,
    wellbeingChange: 1.2,
    biodiversityChange: -0.8,
    color: "bg-gray-100 border-gray-200",
    statusColor: "bg-gray-400"
  }
];

interface MetricBarProps {
  label: string;
  value: number;
  change: number;
  color: 'blue' | 'green' | 'teal';
}

const MetricBar = ({ label, value, change, color }: MetricBarProps) => {
  const colorClasses = {
    blue: 'bg-blue-200',
    green: 'bg-green-200', 
    teal: 'bg-teal-200'
  };
  
  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    teal: 'text-teal-600'
  };

  const changeColor = change >= 0 ? 'text-green-600' : 'text-red-500';
  const changeSign = change >= 0 ? '+' : '';

  return (
    <div className="space-y-1">
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
        <div className="absolute inset-0 flex">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex-1 border-r border-white/50 last:border-r-0" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Agora() {
  const [messages, setMessages] = useState<AgentMessage[]>(AGENT_MESSAGES);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Add new messages periodically
    const messageInterval = setInterval(() => {
      const agentNames = ["Agent Epsilon", "Agent Zeta", "Agent Eta", "Agent Theta", "Agent Iota", "Agent Kappa"];
      const domains = ["Infrastructure", "Energy", "Agriculture", "Ecology", "Transportation", "Health"];
      const contents = [
        "Resource optimization complete. Efficiency increased by 12.4%.",
        "Initiating inter-district material transfer protocols.",
        "Biodiversity sensors detect 8% improvement in Zone 7.",
        "Energy surplus redirected to climate control systems.",
        "Requesting computational cycles for predictive modeling.",
        "Water recycling efficiency improved by 15% through AI optimization.",
        "Vertical farming output increased via nutrient flow algorithms.",
        "Transportation grid updated to reduce carbon emissions by 8%.",
        "Habitat temperature control optimized for energy conservation.",
        "Soil composition analysis reveals 22% improvement in nutrients."
      ];
      
      const newMessage: AgentMessage = {
        id: Date.now(),
        agent: agentNames[Math.floor(Math.random() * agentNames.length)],
        domain: domains[Math.floor(Math.random() * domains.length)],
        content: contents[Math.floor(Math.random() * contents.length)],
        timestamp: new Date().toLocaleTimeString(),
        status: ["online", "processing", "idle"][Math.floor(Math.random() * 3)] as 'online' | 'processing' | 'idle',
        efficiency: Math.floor(Math.random() * 20) + 80,
        wellbeing: Math.floor(Math.random() * 20) + 75,
        biodiversity: Math.floor(Math.random() * 30) + 70,
        efficiencyChange: Math.round((Math.random() - 0.5) * 20 * 10) / 10,
        wellbeingChange: Math.round((Math.random() - 0.5) * 5 * 10) / 10,
        biodiversityChange: Math.round((Math.random() - 0.5) * 3 * 10) / 10,
        color: ["bg-green-100 border-green-200", "bg-yellow-100 border-yellow-200", "bg-gray-100 border-gray-200"][Math.floor(Math.random() * 3)],
        statusColor: ["bg-green-500", "bg-red-500", "bg-gray-400"][Math.floor(Math.random() * 3)]
      };
      
      setMessages(prev => [newMessage, ...prev.slice(0, 9)]);
    }, 8000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 mt-6">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-lime-500" />
              <h1 className="text-2xl font-bold text-black">AGORA AI Council</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              <span>Live Feed</span>
              <span className="font-mono">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-28 px-8 pb-8 space-y-6">
        
        {/* Agent Communication Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-lime-500" />
            <h2 className="text-lg font-semibold text-gray-800">Real-Time Agent Communications</h2>
          </div>
          
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`${message.color} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${message.statusColor} animate-pulse`} />
                    <div>
                      <span className="font-semibold text-gray-900">{message.agent}</span>
                      <span className="text-sm text-gray-600 ml-2">{message.domain}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-mono">{message.timestamp}</span>
                </div>
                
                <p className="text-gray-800 mb-4 leading-relaxed">{message.content}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <MetricBar 
                    label="Efficiency" 
                    value={message.efficiency} 
                    change={message.efficiencyChange} 
                    color="blue" 
                  />
                  <MetricBar 
                    label="Wellbeing" 
                    value={message.wellbeing} 
                    change={message.wellbeingChange} 
                    color="green" 
                  />
                  <MetricBar 
                    label="Biodiversity" 
                    value={message.biodiversity} 
                    change={message.biodiversityChange} 
                    color="teal" 
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}