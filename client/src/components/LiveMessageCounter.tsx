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
    <Card className={`bg-black/40 border-lime-500/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-lime-400" />
              {isLoadingNewMessage && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
            <h3 className="text-sm font-semibold text-lime-400">Live Activity</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Message Count */}
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-white"
              animate={{
                scale: animateCount ? [1, 1.1, 1] : 1,
                color: animateCount ? "#a3e635" : "#ffffff"
              }}
              transition={{ duration: 0.3 }}
            >
              {messageCount}
            </motion.div>
            <div className="text-xs text-gray-400">Messages</div>
            {recentGrowth > 0 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-lime-400"
                >
                  +{recentGrowth} new
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Active Connections */}
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {connectionCount}
            </div>
            <div className="text-xs text-gray-400">Active Links</div>
          </div>

          {/* Message Velocity */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-lg font-bold text-blue-400">
                {velocity}
              </span>
            </div>
            <div className="text-xs text-gray-400">msg/hour</div>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3">
            {/* Most Active Agents */}
            {activeAgents.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-300 mb-2">Most Active</h4>
                <div className="flex gap-2 flex-wrap">
                  {activeAgents.map(({ agent, count }) => (
                    <Badge
                      key={agent}
                      variant="outline"
                      className="text-xs border-lime-500/50 text-lime-400"
                    >
                      {agent} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity Indicator */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-lime-400" />
                <span className="text-gray-400">Last Update</span>
              </div>
              <span className="text-lime-400">
                {lastUpdated.toLocaleTimeString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit' 
                })}
              </span>
            </div>

            {/* Live Status */}
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                isLoadingNewMessage ? 'bg-yellow-400' : 
                messageCount > 0 ? 'bg-lime-400' : 'bg-gray-500'
              }`} />
              <span className="text-gray-400">
                {isLoadingNewMessage ? 'Processing...' : 
                messageCount > 0 ? 'Neural Network Active' : 'Waiting for Activity'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};