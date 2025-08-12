import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface StreamingMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  isComplete: boolean;
  timestamp: number;
  confidence?: number;
  topic?: string;
}

interface AgoraClient {
  ws: WebSocket;
  id: string;
  lastActivity: number;
}

export class AgoraWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, AgoraClient> = new Map();
  private messageStreams: Map<string, NodeJS.Timeout> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws/agora',
      perMessageDeflate: {
        // Enable per-message deflate for better performance
        threshold: 1024,
        concurrencyLimit: 10,
        serverMaxWindowBits: 13,
        serverNoContextTakeover: false,
        clientMaxWindowBits: 13,
        clientNoContextTakeover: false
      }
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('AGORA WebSocket server initialized on /ws/agora');
  }

  private handleConnection(ws: WebSocket) {
    const clientId = this.generateClientId();
    const client: AgoraClient = {
      ws,
      id: clientId,
      lastActivity: Date.now()
    };

    this.clients.set(clientId, client);
    console.log(`AGORA client connected: ${clientId}`);

    // Send welcome message
    this.sendToClient(clientId, {
      id: 'welcome',
      from: 'system',
      to: clientId,
      content: 'Connected to AGORA neural network',
      isComplete: true,
      timestamp: Date.now(),
      confidence: 1
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleClientMessage(clientId, message);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      this.clients.delete(clientId);
      this.cleanupClientStreams(clientId);
      console.log(`AGORA client disconnected: ${clientId}`);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });

    // Start streaming simulated neural activity
    this.initializeNeuralActivity(clientId);
  }

  private handleClientMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.lastActivity = Date.now();
    
    // Broadcast to other clients (for multi-user scenarios)
    this.broadcastMessage(message, clientId);
  }

  private broadcastMessage(message: StreamingMessage, excludeClientId?: string) {
    this.clients.forEach((client, id) => {
      if (id !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(id, message);
      }
    });
  }

  private sendToClient(clientId: string, message: StreamingMessage) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Failed to send message to client ${clientId}:`, error);
      }
    }
  }

  private initializeNeuralActivity(clientId: string) {
    const agents = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa'];
    const topics = [
      'infrastructure optimization',
      'energy distribution',
      'resource allocation',
      'social coordination',
      'ecological balance',
      'transportation flow',
      'health systems',
      'education protocols',
      'governance structures',
      'innovation networks'
    ];

    const createStreamingMessage = () => {
      const fromAgent = agents[Math.floor(Math.random() * agents.length)];
      const toAgent = agents.filter(a => a !== fromAgent)[Math.floor(Math.random() * (agents.length - 1))];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const messageTemplates = [
        `Analyzing ${topic} patterns - detecting optimization opportunities`,
        `Coordinating with ${toAgent} systems for ${topic} enhancement`,
        `Processing ${topic} data streams - confidence levels rising`,
        `Implementing ${topic} protocols with distributed consensus`,
        `Monitoring ${topic} metrics - adaptive adjustments in progress`,
        `Establishing ${topic} connections with neighboring nodes`,
        `Optimizing ${topic} efficiency through machine learning`,
        `Synchronizing ${topic} operations across network clusters`
      ];

      const content = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
      
      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        from: fromAgent,
        to: toAgent,
        content,
        isComplete: false,
        timestamp: Date.now(),
        confidence: 0.7 + Math.random() * 0.3,
        topic
      };
    };

    const streamMessage = (message: StreamingMessage) => {
      const chunks = message.content.split(' ');
      let currentChunk = 0;
      const streamId = `stream_${message.id}`;
      
      const sendChunk = () => {
        if (currentChunk < chunks.length) {
          const progress = currentChunk / chunks.length;
          const partialMessage = {
            ...message,
            content: chunks.slice(0, currentChunk + 1).join(' '),
            isComplete: currentChunk === chunks.length - 1,
            streamProgress: progress
          };
          
          this.sendToClient(clientId, partialMessage);
          currentChunk++;
          
          // Variable delay for natural typing rhythm
          const delay = 50 + Math.random() * 200;
          const timeout = setTimeout(sendChunk, delay);
          this.messageStreams.set(streamId, timeout);
        } else {
          this.messageStreams.delete(streamId);
        }
      };

      sendChunk();
    };

    // Start neural activity simulation
    const scheduleNextMessage = () => {
      // Poisson process with exponential inter-arrival times
      const lambda = 0.5; // Average messages per second
      const delay = -Math.log(Math.random()) / lambda * 1000;
      const jitteredDelay = delay + Math.random() * 2000; // Add up to 2s jitter
      
      setTimeout(() => {
        if (this.clients.has(clientId)) {
          const message = createStreamingMessage();
          streamMessage(message);
          scheduleNextMessage();
        }
      }, Math.max(500, jitteredDelay));
    };

    scheduleNextMessage();
  }

  private cleanupClientStreams(clientId: string) {
    // Clear any active message streams for this client
    this.messageStreams.forEach((timeout, streamId) => {
      if (streamId.includes(clientId)) {
        clearTimeout(timeout);
        this.messageStreams.delete(streamId);
      }
    });
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clean up inactive clients
  public startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      const timeout = 300000; // 5 minutes

      this.clients.forEach((client, id) => {
        if (now - client.lastActivity > timeout && client.ws.readyState !== WebSocket.OPEN) {
          this.clients.delete(id);
          this.cleanupClientStreams(id);
        }
      });
    }, 60000); // Check every minute
  }

  public getConnectionCount(): number {
    return this.clients.size;
  }
}