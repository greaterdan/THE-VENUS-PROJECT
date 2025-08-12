// WebSocket manager for real-time streaming agent conversations
export interface StreamingMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  isComplete: boolean;
  timestamp: number;
  confidence?: number;
  topic?: string;
  embedding?: number[];
}

export interface AgentMemory {
  agentId: string;
  recentMessages: StreamingMessage[];
  topics: Set<string>;
  confidence: number;
  lastActivity: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: StreamingMessage[] = [];
  private agentMemories: Map<string, AgentMemory> = new Map();
  
  // Callbacks
  private onMessage: ((message: StreamingMessage) => void) | null = null;
  private onConnectionChange: ((connected: boolean) => void) | null = null;

  // Poisson process for staggered message timing
  private poissonLambda = 0.3; // Average messages per 100ms
  private messageBacklog: StreamingMessage[] = [];
  private processingTimer: number | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/agora`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('AGORA WebSocket connected');
        this.reconnectAttempts = 0;
        this.onConnectionChange?.(true);
        this.flushMessageQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: StreamingMessage = JSON.parse(event.data);
          this.processIncomingMessage(message);
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('AGORA WebSocket disconnected');
        this.onConnectionChange?.(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('AGORA WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Reconnecting WebSocket (attempt ${this.reconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()!;
      this.ws.send(JSON.stringify(message));
    }
  }

  private processIncomingMessage(message: StreamingMessage) {
    // Update agent memory
    this.updateAgentMemory(message);
    
    // Add to processing backlog with Poisson timing
    this.messageBacklog.push(message);
    
    if (!this.processingTimer) {
      this.startPoissonProcessing();
    }
  }

  private startPoissonProcessing() {
    const processNext = () => {
      if (this.messageBacklog.length === 0) {
        this.processingTimer = null;
        return;
      }

      const message = this.messageBacklog.shift()!;
      this.onMessage?.(message);

      // Calculate next delay using Poisson distribution
      const delay = -Math.log(Math.random()) / this.poissonLambda * 100; // Scale to ms
      const jitteredDelay = delay + Math.random() * 300; // Add 0-300ms jitter

      this.processingTimer = window.setTimeout(processNext, Math.max(100, jitteredDelay));
    };

    processNext();
  }

  private updateAgentMemory(message: StreamingMessage) {
    const agentId = message.from;
    
    if (!this.agentMemories.has(agentId)) {
      this.agentMemories.set(agentId, {
        agentId,
        recentMessages: [],
        topics: new Set(),
        confidence: message.confidence || 0.8,
        lastActivity: Date.now()
      });
    }

    const memory = this.agentMemories.get(agentId)!;
    memory.recentMessages.push(message);
    memory.lastActivity = Date.now();
    
    if (message.topic) {
      memory.topics.add(message.topic);
    }

    if (message.confidence !== undefined) {
      memory.confidence = lerp(memory.confidence, message.confidence, 0.3);
    }

    // Keep only recent messages (sliding window)
    const maxMessages = 10;
    const maxAge = 60000; // 1 minute
    const now = Date.now();
    
    memory.recentMessages = memory.recentMessages
      .filter(msg => now - msg.timestamp < maxAge)
      .slice(-maxMessages);
  }

  // Topic similarity for intelligent routing
  private calculateTopicSimilarity(topics1: Set<string>, topics2: Set<string>): number {
    const topics1Array = Array.from(topics1);
    const topics2Array = Array.from(topics2);
    const intersection = new Set(topics1Array.filter(x => topics2.has(x)));
    const union = new Set([...topics1Array, ...topics2Array]);
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // Find best agents to continue conversation
  public findRelatedAgents(fromAgent: string, topic?: string): string[] {
    const fromMemory = this.agentMemories.get(fromAgent);
    if (!fromMemory) return [];

    const candidates = Array.from(this.agentMemories.entries())
      .filter(([id]) => id !== fromAgent)
      .map(([id, memory]) => ({
        id,
        similarity: this.calculateTopicSimilarity(fromMemory.topics, memory.topics),
        confidence: memory.confidence,
        recentActivity: Date.now() - memory.lastActivity
      }))
      .filter(candidate => candidate.recentActivity < 30000) // Active in last 30s
      .sort((a, b) => {
        // Weight by similarity, confidence, and recent activity
        const scoreA = a.similarity * 0.5 + a.confidence * 0.3 - (a.recentActivity / 30000) * 0.2;
        const scoreB = b.similarity * 0.5 + b.confidence * 0.3 - (b.recentActivity / 30000) * 0.2;
        return scoreB - scoreA;
      });

    return candidates.slice(0, 3).map(c => c.id);
  }

  public setMessageHandler(handler: (message: StreamingMessage) => void) {
    this.onMessage = handler;
  }

  public setConnectionHandler(handler: (connected: boolean) => void) {
    this.onConnectionChange = handler;
  }

  public sendMessage(message: Omit<StreamingMessage, 'timestamp'>) {
    const fullMessage: StreamingMessage = {
      ...message,
      timestamp: Date.now()
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      this.messageQueue.push(fullMessage);
    }
  }

  public getAgentMemory(agentId: string): AgentMemory | undefined {
    return this.agentMemories.get(agentId);
  }

  public getAgentConfidence(agentId: string): number {
    return this.agentMemories.get(agentId)?.confidence || 0.8;
  }

  public disconnect() {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Lerp utility for confidence interpolation
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;