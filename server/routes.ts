import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAgentConversation } from "./grok";

export async function registerRoutes(app: Express): Promise<Server> {
  // Grok-powered AI agent conversation endpoint
  app.get('/api/agent-conversation', async (req, res) => {
    try {
      const conversation = await generateAgentConversation({
        currentDecision: 'Sustainable Habitat Expansion Protocol',
        recentEvents: ['Grid optimization complete', 'Biodiversity assessment updated', 'Resource allocation adjusted'],
        activeAgents: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']
      });
      
      res.json(conversation);
    } catch (error) {
      console.error('Agent conversation generation error:', error);
      res.status(500).json({ error: 'Failed to generate agent conversation' });
    }
  });

  // Mock endpoints for existing functionality
  app.get('/api/network-stats', (req, res) => {
    res.json({
      totalNodes: 10,
      activeConnections: Math.floor(Math.random() * 8) + 15,
      consensusLevel: 94.7 + (Math.random() - 0.5) * 2,
      throughput: Math.floor(Math.random() * 50) + 120
    });
  });

  app.get('/api/leaderboard/week', (req, res) => {
    const leaderboard = [
      { rank: 1, username: 'neural_architect', flops: 2847392, rewards: 1247.8, gpu: 'RTX 4090' },
      { rank: 2, username: 'quantum_dev', flops: 2195847, rewards: 967.2, gpu: 'RTX 4080' },
      { rank: 3, username: 'eco_builder', flops: 1923648, rewards: 845.1, gpu: 'RTX 3080 Ti' },
      { rank: 4, username: 'solar_optimizer', flops: 1647295, rewards: 723.4, gpu: 'RTX 3070' },
      { rank: 5, username: 'habitat_designer', flops: 1398472, rewards: 614.2, gpu: 'RTX 3060 Ti' }
    ].map(user => ({
      ...user,
      flops: user.flops + Math.floor(Math.random() * 10000) - 5000,
      rewards: user.rewards + (Math.random() - 0.5) * 20
    }));
    
    res.json(leaderboard);
  });

  const httpServer = createServer(app);

  return httpServer;
}
