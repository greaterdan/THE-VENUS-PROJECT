import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentMessage {
  id: number;
  agent: string;
  message: string;
  time: string;
  status: 'active' | 'processing' | 'complete';
  domain: string;
}

const MESSAGES: AgentMessage[] = [
  {
    id: 1,
    agent: "Alpha",
    message: "Habitat expansion protocols initialized. Resource allocation optimized for sustainable growth patterns.",
    time: "14:23",
    status: 'complete',
    domain: "Infrastructure"
  },
  {
    id: 2,
    agent: "Beta", 
    message: "Energy grid stabilized at 94% efficiency. Solar array recalibration successful.",
    time: "14:24",
    status: 'active',
    domain: "Energy"
  },
  {
    id: 3,
    agent: "Gamma",
    message: "Agricultural yield exceeded projections by 18%. Implementing nutrient cycle optimization.",
    time: "14:24",
    status: 'processing',
    domain: "Agriculture"
  },
  {
    id: 4,
    agent: "Delta",
    message: "Ecosystem restoration Phase 3 completed. Biodiversity indices within target parameters.",
    time: "14:25",
    status: 'complete',
    domain: "Ecology"
  },
  {
    id: 5,
    agent: "Epsilon",
    message: "Community wellbeing metrics show positive trend. Cultural integration proceeding smoothly.",
    time: "14:25",
    status: 'active',
    domain: "Social"
  },
  {
    id: 6,
    agent: "Zeta",
    message: "Transportation network efficiency increased. Zero-emission mobility targets achieved.",
    time: "14:26",
    status: 'complete',
    domain: "Transport"
  },
  {
    id: 7,
    agent: "Eta",
    message: "Preventive healthcare systems operational. Diagnostic accuracy maintaining 97.3%.",
    time: "14:26",
    status: 'processing',
    domain: "Health"
  },
  {
    id: 8,
    agent: "Theta",
    message: "Educational frameworks deployed. Knowledge accessibility expanded across all sectors.",
    time: "14:27",
    status: 'active',
    domain: "Education"
  },
  {
    id: 9,
    agent: "Iota",
    message: "Resource distribution algorithms updated. Scarcity elimination protocols active.",
    time: "14:27",
    status: 'processing',
    domain: "Resources"
  },
  {
    id: 10,
    agent: "Kappa",
    message: "Ethical frameworks validated. Decision-making consensus achieved across all domains.",
    time: "14:28",
    status: 'complete',
    domain: "Ethics"
  }
];

const StatusIndicator = ({ status }: { status: string }) => {
  const colors = {
    active: 'bg-green-400',
    processing: 'bg-yellow-400', 
    complete: 'bg-blue-400'
  };
  
  return (
    <div className={`w-1.5 h-1.5 rounded-full ${colors[status as keyof typeof colors]} animate-pulse`} />
  );
};

const NetworkVisualization = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-10 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 800 200">
        {/* Network nodes */}
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <circle
              cx={80 + i * 70}
              cy={100}
              r="3"
              fill="currentColor"
              className="text-lime-500"
            >
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
            {i < 9 && (
              <line
                x1={80 + i * 70}
                y1={100}
                x2={80 + (i + 1) * 70}
                y2={100}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-300"
                opacity="0.5"
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

const TypewriterEffect = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, 30 + delay);
    
    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);
  
  return <span>{displayText}</span>;
};

export default function Agora() {
  const [activeAgents, setActiveAgents] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Count active agents
    const active = MESSAGES.filter(m => m.status === 'active').length;
    setActiveAgents(active);
    
    // Update time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      
      {/* Background Network Visualization */}
      <NetworkVisualization />
      
      <div className="flex h-screen pt-20">
        
        {/* Left Side - Chat Interface */}
        <div className="w-2/3 flex flex-col border-r border-gray-100">
          
          {/* Header */}
          <div className="px-6 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-light tracking-wide text-black">
                  AGORA
                </h1>
                <p className="text-xs text-gray-500 font-mono">
                  Neural Network Communications
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-gray-600">
                    {activeAgents} ACTIVE
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded text-center">
                  {currentTime}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="space-y-3">
              {MESSAGES.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Agent Info */}
                    <div className="flex-shrink-0 w-16">
                      <div className="flex items-center gap-1 mb-0.5">
                        <StatusIndicator status={message.status} />
                        <span className="text-xs font-mono text-gray-500 uppercase">
                          {message.agent}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {message.time}
                      </div>
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                          {message.domain}
                        </span>
                      </div>
                      <div className="text-sm text-gray-800 leading-snug">
                        <TypewriterEffect text={message.message} delay={index * 50} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* System Status Footer */}
          <div className="px-6 py-2 border-t border-gray-100 bg-gray-50/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  Operational
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  12ms
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  94.7%
                </span>
              </div>
              <div className="text-xs font-mono text-gray-400">
                {currentTime}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Space */}
        <div className="w-1/3 bg-gray-50/50 p-6">
          <div className="text-center text-gray-400 mt-20">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto opacity-30" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2"/>
                <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1"/>
                <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </div>
            <p className="text-sm">Visual Analytics Space</p>
            <p className="text-xs mt-1">Network topology, metrics, and system overview</p>
          </div>
        </div>
      </div>

    </div>
  );
}