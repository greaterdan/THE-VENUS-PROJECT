import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalConversation } from '@/contexts/GlobalConversationContext';
import { MessageSquare, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveMessageCounterProps {
  className?: string;
  showDetails?: boolean;
  onExpandConversation?: () => void;
}

export const LiveMessageCounter: React.FC<LiveMessageCounterProps> = ({
  className = "",
  showDetails = true,
  onExpandConversation
}) => {
  const { chatMessages, activeConnections, isLoadingNewMessage } = useGlobalConversation();
  const [messageCount, setMessageCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [recentGrowth, setRecentGrowth] = useState(0);
  const [animateCount, setAnimateCount] = useState(false);

  // Update message count with animation trigger
  useEffect(() => {
    const newCount = chatMessages.length;
    const growth = newCount - messageCount;
    
    if (growth > 0) {
      setRecentGrowth(growth);
      setAnimateCount(true);
      setLastUpdated(new Date());
      
      // Reset animation after brief delay
      const timeout = setTimeout(() => setAnimateCount(false), 500);
      return () => clearTimeout(timeout);
    }
    
    setMessageCount(newCount);
  }, [chatMessages.length, messageCount]);

  // Calculate message velocity (messages per minute)
  const getMessageVelocity = useCallback(() => {
    if (chatMessages.length < 2) return 0;
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const recentMessages = chatMessages.filter(msg => {
      const msgTime = new Date(`${new Date().toDateString()} ${msg.timestamp}`);
      return msgTime >= fiveMinutesAgo;
    });
    
    return Math.round((recentMessages.length / 5) * 60); // Messages per hour
  }, [chatMessages]);

  // Get most active agents
  const getMostActiveAgents = useCallback(() => {
    const agentActivity = chatMessages.reduce((acc, msg) => {
      acc[msg.from] = (acc[msg.from] || 0) + 1;
      acc[msg.to] = (acc[msg.to] || 0) + 0.5; // Receiving counts less
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(agentActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([agent, count]) => ({ agent, count: Math.round(count) }));
  }, [chatMessages]);

  const velocity = getMessageVelocity();
  const activeAgents = getMostActiveAgents();
  const connectionCount = activeConnections.length;

  // When showDetails is false, render minimal version
  if (!showDetails) {
    return (
      <div className={`text-xs text-gray-500 text-center ${className}`}>
        {messageCount} messages
      </div>
    );
  }

  return (
    <motion.div
      className={`text-center ${className}`}
      animate={{
        scale: animateCount ? [1, 1.05, 1] : 1
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-2xl font-bold text-gray-700"
        animate={{
          color: animateCount ? "#059669" : "#374151"
        }}
        transition={{ duration: 0.3 }}
      >
        {messageCount}
      </motion.div>
    </motion.div>
  );
};