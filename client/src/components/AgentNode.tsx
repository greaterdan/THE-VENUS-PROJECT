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
    active: 'bg-green-400 shadow-green-400/50',
    processing: 'bg-yellow-400 shadow-yellow-400/50',
    idle: 'bg-gray-300 shadow-gray-300/50',
    negotiating: 'bg-blue-400 shadow-blue-400/50'
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
      <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <span className="text-xs font-bold text-white">{agent.name.charAt(0)}</span>
      </div>
      
      {/* Agent info tooltip */}
      {isHovered && (
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-xl z-10 min-w-48"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold text-gray-800">{agent.name}</h4>
          <p className="text-sm text-gray-600">{agent.domain}</p>
          <p className="text-xs text-gray-500 mt-1">Status: {agent.status}</p>
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-700">Resources:</p>
            <p className="text-xs text-gray-600">{agent.resources.join(', ')}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}