import { useState, useEffect, useRef, useCallback } from 'react';
import { animationEngine } from '@/lib/AnimationEngine';
import { WebSocketManager, StreamingMessage, AgentMemory } from '@/lib/WebSocketManager';

export interface FluidConnection {
  id: string;
  from: string;
  to: string;
  type: string;
  timestamp: number;
  confidence: number;
  isActive: boolean;
  streamProgress: number;
  content?: string;
}

export interface FluidAgent {
  id: string;
  name: string;
  position: { x: number; y: number };
  domain: string;
  alignment: number;
  status: 'active' | 'processing' | 'idle';
  confidence: number;
  recentActivity: number;
  resources: {
    surplus: string[];
    deficit: string[];
  };
}

export const useFluidAgora = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [fluidConnections, setFluidConnections] = useState<FluidConnection[]>([]);
  const [streamingMessages, setStreamingMessages] = useState<StreamingMessage[]>([]);
  const [agentStates, setAgentStates] = useState<Map<string, AgentMemory>>(new Map());
  
  const wsManager = useRef<WebSocketManager | null>(null);
  const connectionMap = useRef<Map<string, FluidConnection>>(new Map());
  
  // Performance monitoring
  const [fps, setFps] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);

  // Initialize WebSocket and animation engine
  useEffect(() => {
    // Start animation engine
    animationEngine.start();
    
    // Initialize WebSocket manager
    wsManager.current = new WebSocketManager();
    
    wsManager.current.setConnectionHandler(setIsConnected);
    wsManager.current.setMessageHandler(handleStreamingMessage);

    return () => {
      animationEngine.stop();
      wsManager.current?.disconnect();
    };
  }, []);

  // Handle incoming streaming messages
  const handleStreamingMessage = useCallback((message: StreamingMessage) => {
    setStreamingMessages(prev => {
      const updated = [...prev];
      const existing = updated.findIndex(m => m.id === message.id);
      
      if (existing >= 0) {
        updated[existing] = message;
      } else {
        updated.push(message);
        // Keep only recent messages
        if (updated.length > 50) {
          updated.splice(0, updated.length - 50);
        }
      }
      
      return updated;
    });

    // Create or update fluid connection
    const connectionId = `${message.from}-${message.to}-${message.timestamp}`;
    const connection: FluidConnection = {
      id: connectionId,
      from: message.from,
      to: message.to,
      type: message.topic || 'data',
      timestamp: message.timestamp,
      confidence: message.confidence || 0.8,
      isActive: !message.isComplete,
      streamProgress: message.isComplete ? 1 : (message.content.length / 200), // Estimate progress
      content: message.content
    };

    connectionMap.current.set(connectionId, connection);
    updateFluidConnections();

    // Update agent memory
    if (wsManager.current) {
      const memory = wsManager.current.getAgentMemory(message.from);
      if (memory) {
        setAgentStates(prev => new Map(prev.set(message.from, memory)));
      }
    }

  }, []);

  // Update fluid connections with cleanup
  const updateFluidConnections = useCallback(() => {
    const now = Date.now();
    const maxAge = 8000; // 8 seconds
    
    const activeConnections: FluidConnection[] = [];
    
    connectionMap.current.forEach((connection, id) => {
      if (now - connection.timestamp < maxAge) {
        // Update stream progress for active connections
        if (connection.isActive) {
          const age = now - connection.timestamp;
          connection.streamProgress = Math.min(1, age / 3000); // Complete in 3 seconds
          
          if (connection.streamProgress >= 1) {
            connection.isActive = false;
          }
        }
        
        activeConnections.push(connection);
      } else {
        connectionMap.current.delete(id);
      }
    });
    
    setFluidConnections(activeConnections);
    setConnectionCount(activeConnections.length);
  }, []);

  // Cleanup old connections periodically
  useEffect(() => {
    const interval = setInterval(updateFluidConnections, 100); // 10fps cleanup
    return () => clearInterval(interval);
  }, [updateFluidConnections]);

  // Monitor FPS
  useEffect(() => {
    const unsubscribe = animationEngine.subscribe(() => {
      setFps(animationEngine.currentFps);
    });
    return unsubscribe;
  }, []);

  // Get fluid agents with enhanced state
  const getFluidAgents = useCallback((): FluidAgent[] => {
    const baseAgents = [
      { id: 'alpha', name: 'ALPHA', domain: 'Infrastructure & Habitat Design', alignment: 94, position: { x: 150, y: 100 } },
      { id: 'beta', name: 'BETA', domain: 'Energy Systems', alignment: 91, position: { x: 300, y: 80 } },
      { id: 'gamma', name: 'GAMMA', domain: 'Food & Agriculture', alignment: 89, position: { x: 450, y: 100 } },
      { id: 'delta', name: 'DELTA', domain: 'Ecology & Environmental Restoration', alignment: 96, position: { x: 550, y: 200 } },
      { id: 'epsilon', name: 'EPSILON', domain: 'Social Dynamics & Wellbeing', alignment: 87, position: { x: 500, y: 300 } },
      { id: 'zeta', name: 'ZETA', domain: 'Transportation & Mobility', alignment: 93, position: { x: 350, y: 350 } },
      { id: 'eta', name: 'ETA', domain: 'Health & Medical Systems', alignment: 92, position: { x: 200, y: 320 } },
      { id: 'theta', name: 'THETA', domain: 'Education & Knowledge Access', alignment: 88, position: { x: 100, y: 250 } },
      { id: 'iota', name: 'IOTA', domain: 'Resource Management & Allocation', alignment: 90, position: { x: 50, y: 180 } },
      { id: 'kappa', name: 'KAPPA', domain: 'Culture, Ethics & Governance', alignment: 95, position: { x: 250, y: 200 } }
    ];

    return baseAgents.map(agent => {
      const memory = agentStates.get(agent.id);
      const recentConnections = fluidConnections.filter(c => c.from === agent.id || c.to === agent.id);
      const isActive = recentConnections.some(c => c.isActive);
      
      return {
        ...agent,
        status: isActive ? 'active' : memory ? 'processing' : 'idle',
        confidence: memory?.confidence || 0.8,
        recentActivity: memory?.lastActivity || Date.now() - 60000,
        resources: {
          surplus: ['Data', 'Bandwidth', 'Processing'],
          deficit: ['Energy', 'Storage']
        }
      } as FluidAgent;
    });
  }, [agentStates, fluidConnections]);

  // Send message through WebSocket
  const sendMessage = useCallback((from: string, to: string, content: string, topic?: string) => {
    if (wsManager.current) {
      wsManager.current.sendMessage({
        id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        from,
        to,
        content,
        isComplete: true,
        confidence: 0.9,
        topic
      });
    }
  }, []);

  // Get related agents for conversation flow
  const getRelatedAgents = useCallback((fromAgent: string, topic?: string): string[] => {
    if (wsManager.current) {
      return wsManager.current.findRelatedAgents(fromAgent, topic);
    }
    return [];
  }, []);

  return {
    // Connection state
    isConnected,
    fluidConnections,
    streamingMessages,
    agentStates,
    
    // Agent data
    fluidAgents: getFluidAgents(),
    
    // Performance metrics
    fps,
    connectionCount,
    
    // Actions
    sendMessage,
    getRelatedAgents
  };
};