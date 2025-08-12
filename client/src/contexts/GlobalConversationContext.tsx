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

  // Global conversation creation
  const createGlobalConversation = async () => {
    if (!isComponentMounted.current) return;
    
    try {
      setIsLoadingNewMessage(true);
      
      const response = await fetch('/api/agent-conversation');
      if (!response.ok) throw new Error('Failed to fetch conversation');
      const conversation = await response.json();
      
      if (!isComponentMounted.current) return;

      const newConnection: ActiveConnection = {
        id: `conn-${Date.now()}-${Math.random()}`,
        from: conversation.from,
        to: conversation.to,
        type: conversation.type,
        message: conversation.message,
        timestamp: Date.now()
      };

      // Update global connections
      setActiveConnections(prev => {
        const filtered = prev.filter(conn => Date.now() - conn.timestamp < 4000);
        return [...filtered, newConnection];
      });

      // Add new message to global chat
      const chatMessage: ChatMessage = {
        id: newConnection.id,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        from: newConnection.from.toUpperCase(),
        to: newConnection.to.toUpperCase(),
        message: newConnection.message,
        type: newConnection.type
      };

      setChatMessages(current => {
        if (current.some(msg => msg.id === chatMessage.id)) {
          return current;
        }
        return [...current.slice(-19), chatMessage];
      });

    } catch (error) {
      console.error('Global conversation failed:', error);
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
      
      await createGlobalConversation();
      
      if (!mounted) return;
      
      conversationIntervalRef.current = setInterval(() => {
        if (mounted && isComponentMounted.current) {
          createGlobalConversation();
        }
      }, 12000);
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