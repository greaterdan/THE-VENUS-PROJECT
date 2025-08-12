import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface ActiveConnection {
  id: string;
  from: string;
  to: string;
  type: 'energy' | 'material' | 'data' | 'time';
  message: string;
  timestamp: number;
}

interface ChatMessage {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  message: string;
  type: 'energy' | 'material' | 'data' | 'time';
}

interface GlobalConversationContextType {
  chatMessages: ChatMessage[];
  activeConnections: ActiveConnection[];
  isLoadingNewMessage: boolean;
}

const GlobalConversationContext = createContext<GlobalConversationContextType>({
  chatMessages: [],
  activeConnections: [],
  isLoadingNewMessage: false,
});

export const useGlobalConversation = () => {
  const context = useContext(GlobalConversationContext);
  if (!context) {
    throw new Error('useGlobalConversation must be used within GlobalConversationProvider');
  }
  return context;
};

export const GlobalConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);
  const [isLoadingNewMessage, setIsLoadingNewMessage] = useState(false);
  
  const isComponentMounted = useRef(true);
  const conversationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
      if (conversationIntervalRef.current) {
        clearInterval(conversationIntervalRef.current);
      }
    };
  }, []);

  // Create multiple simultaneous conversations
  const createMultipleConversations = async () => {
    if (!isComponentMounted.current) return;
    
    // Generate 2-4 simultaneous conversations for dynamic effect
    const conversationCount = Math.floor(Math.random() * 3) + 2; // 2-4 conversations
    const conversationPromises = Array.from({ length: conversationCount }, async () => {
      try {
        const response = await fetch('/api/agent-conversation');
        if (!response.ok) throw new Error('Failed to fetch conversation');
        return await response.json();
      } catch (error) {
        console.error('Single conversation failed:', error);
        return null;
      }
    });

    try {
      setIsLoadingNewMessage(true);
      
      const conversations = await Promise.all(conversationPromises);
      const validConversations = conversations.filter(conv => conv !== null);
      
      if (!isComponentMounted.current || validConversations.length === 0) return;

      const newConnections = validConversations.map((conversation, index) => ({
        id: `conn-${Date.now()}-${Math.random()}-${index}`,
        from: conversation.from,
        to: conversation.to,
        type: conversation.type,
        message: conversation.message,
        timestamp: Date.now() + (index * 200) // Slight time offset for visual effect
      }));

      // Update global connections with fade-out effect
      setActiveConnections(prev => {
        const filtered = prev.filter(conn => Date.now() - conn.timestamp < 6000); // Extended for multi-agent
        return [...filtered, ...newConnections];
      });

      // Add new messages to global chat
      const chatMessages = newConnections.map(connection => ({
        id: connection.id,
        timestamp: new Date(connection.timestamp).toLocaleTimeString('en-US', { 
          hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
        }),
        from: connection.from.toUpperCase(),
        to: connection.to.toUpperCase(),
        message: connection.message,
        type: connection.type
      }));

      setChatMessages(current => {
        const existingIds = new Set(current.map(msg => msg.id));
        const newMessages = chatMessages.filter(msg => !existingIds.has(msg.id));
        return [...current, ...newMessages];
      });

    } catch (error) {
      console.error('Multi-agent conversations failed:', error);
    } finally {
      if (isComponentMounted.current) {
        setIsLoadingNewMessage(false);
      }
    }
  };

  // Initialize global conversations
  useEffect(() => {
    let mounted = true;
    
    const startGlobalConversations = async () => {
      if (!mounted) return;
      
      await createMultipleConversations();
      
      if (!mounted) return;
      
      conversationIntervalRef.current = setInterval(() => {
        if (mounted && isComponentMounted.current) {
          createMultipleConversations();
        }
      }, 8000); // More frequent for dynamic effect
    };

    const timer = setTimeout(startGlobalConversations, 1500);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (conversationIntervalRef.current) {
        clearInterval(conversationIntervalRef.current);
      }
    };
  }, []);

  const value = {
    chatMessages,
    activeConnections,
    isLoadingNewMessage,
  };

  return (
    <GlobalConversationContext.Provider value={value}>
      {children}
    </GlobalConversationContext.Provider>
  );
};