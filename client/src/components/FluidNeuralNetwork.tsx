import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useFluidAgora } from '@/hooks/useFluidAgora';
import { FluidConnectionLine } from '@/components/FluidConnectionLine';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Network, Activity, Cpu } from 'lucide-react';

interface FluidNeuralNetworkProps {
  className?: string;
  showPerformanceStats?: boolean;
}

export const FluidNeuralNetwork: React.FC<FluidNeuralNetworkProps> = ({
  className = "",
  showPerformanceStats = true
}) => {
  const {
    fluidConnections,
    fluidAgents,
    isConnected,
    fps,
    connectionCount,
    sendMessage
  } = useFluidAgora();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Agent status colors
  const getAgentStatusColor = useCallback((status: string, confidence: number) => {
    switch (status) {
      case 'active':
        return `hsl(${120 + confidence * 60}, 100%, ${50 + confidence * 20}%)`;
      case 'processing':
        return `hsl(${60 + confidence * 30}, 90%, ${60 + confidence * 15}%)`;
      default:
        return `hsl(${200}, 50%, ${40 + confidence * 20}%)`;
    }
  }, []);

  // Connection strength visualization
  const getConnectionIntensity = useCallback((confidence: number, progress: number) => {
    return Math.min(1, confidence * progress * 1.2);
  }, []);

  // Render agent nodes
  const renderAgents = useMemo(() => {
    return fluidAgents.map((agent) => (
      <motion.g
        key={agent.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
      >
        {/* Agent glow effect */}
        <motion.circle
          cx={agent.position.x}
          cy={agent.position.y}
          r="20"
          fill="none"
          stroke={getAgentStatusColor(agent.status, agent.confidence)}
          strokeWidth="0.5"
          opacity="0.3"
          animate={{
            r: [18, 24, 18],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2 + agent.confidence,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main agent node */}
        <motion.circle
          cx={agent.position.x}
          cy={agent.position.y}
          r="12"
          fill={getAgentStatusColor(agent.status, agent.confidence)}
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1"
          animate={{
            scale: agent.status === 'active' ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 1.5,
            repeat: agent.status === 'active' ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        
        {/* Agent label */}
        <text
          x={agent.position.x}
          y={agent.position.y - 20}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          opacity="0.9"
        >
          {agent.name}
        </text>
        
        {/* Confidence indicator */}
        <motion.circle
          cx={agent.position.x + 15}
          cy={agent.position.y - 15}
          r="3"
          fill={`hsl(${agent.confidence * 120}, 100%, 70%)`}
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.g>
    ));
  }, [fluidAgents, selectedAgent, getAgentStatusColor]);

  // Render fluid connections
  const renderConnections = useMemo(() => {
    return fluidConnections.map((connection) => {
      const fromAgent = fluidAgents.find(a => a.id === connection.from);
      const toAgent = fluidAgents.find(a => a.id === connection.to);
      
      if (!fromAgent || !toAgent) return null;
      
      return (
        <FluidConnectionLine
          key={connection.id}
          connection={connection}
          from={{ x: fromAgent.position.x, y: fromAgent.position.y }}
          to={{ x: toAgent.position.x, y: toAgent.position.y }}
        />
      );
    });
  }, [fluidConnections, fluidAgents]);

  return (
    <div className={`relative ${className}`}>
      {/* Neural Network Canvas */}
      <div className="relative w-full h-96 bg-black/20 rounded-lg border border-lime-500/20 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background grid */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(163, 230, 53, 0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Fluid connections */}
          {renderConnections}
          
          {/* Agent nodes */}
          {renderAgents}
        </svg>

        {/* Connection status overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-lime-500' : 'bg-red-500'}`} />
          <span className="text-xs text-lime-400">
            {isConnected ? 'Neural Link Active' : 'Neural Link Disconnected'}
          </span>
        </div>

        {/* Performance stats */}
        {showPerformanceStats && (
          <div className="absolute top-2 right-2 flex gap-3 text-xs text-lime-400">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>{fps}fps</span>
            </div>
            <div className="flex items-center gap-1">
              <Network className="w-3 h-3" />
              <span>{connectionCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Agent Details Panel */}
      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-4"
        >
          <Card className="bg-black/40 border-lime-500/30">
            <CardContent className="p-4">
              {(() => {
                const agent = fluidAgents.find(a => a.id === selectedAgent);
                if (!agent) return null;
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-lime-400">
                        Agent {agent.name}
                      </h3>
                      <Badge 
                        className={`${agent.status === 'active' ? 'bg-lime-500' : 
                          agent.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'} text-black`}
                      >
                        {agent.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-300">{agent.domain}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-lime-400">{(agent.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={agent.confidence * 100} 
                        className="h-2 bg-black/50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-semibold text-lime-400 mb-1">Resource Surplus</h4>
                        <div className="space-y-1">
                          {agent.resources.surplus.map((resource, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-green-500/50 text-green-400">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-400 mb-1">Resource Deficit</h4>
                        <div className="space-y-1">
                          {agent.resources.deficit.map((resource, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-red-500/50 text-red-400">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};