import { useState } from 'react';
import { motion } from 'framer-motion';

interface Agent {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'processing' | 'idle' | 'negotiating';
  resources: string[];
  urgency: 'low' | 'medium' | 'high';
}

interface AgentNodeProps {
  agent: Agent;
  position: { x: number; y: number };
  connections: string[];
  onHover: (agent: Agent | null) => void;
}

export default function AgentNode({ agent, position, connections, onHover }: AgentNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    active: 'bg-lime-500 shadow-lime-500/50',
    processing: 'bg-yellow-500 shadow-yellow-500/50',
    idle: 'bg-gray-400 shadow-gray-400/50',
    negotiating: 'bg-blue-500 shadow-blue-500/50'
  };

  const urgencyPulse = {
    low: '',
    medium: 'animate-pulse',
    high: 'animate-bounce'
  };

  return (
    <motion.div
      className={`absolute w-16 h-16 rounded-full ${statusColors[agent.status]} shadow-lg transition-all duration-300 cursor-pointer ${urgencyPulse[agent.urgency]}`}
      style={{ left: position.x - 32, top: position.y - 32 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
      onHoverStart={() => {
        setIsHovered(true);
        onHover(agent);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onHover(null);
      }}
    >
      <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
        <span className="text-xs font-bold text-black">{agent.name.charAt(0)}</span>
      </div>
      
      {/* Agent info tooltip */}
      {isHovered && (
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl z-10 min-w-48 border border-lime-500/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold text-black">{agent.name}</h4>
          <p className="text-sm text-black">{agent.domain}</p>
          <p className="text-xs text-gray-600 mt-1">Status: {agent.status}</p>
          <div className="mt-2">
            <p className="text-xs font-medium text-black">Resources:</p>
            <p className="text-xs text-gray-600">{agent.resources.join(', ')}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}