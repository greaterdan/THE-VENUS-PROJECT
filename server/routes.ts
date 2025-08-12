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
      totalNodesOnline: 2847 + Math.floor(Math.random() * 200) - 100,
      totalTflops: 156.7 + (Math.random() - 0.5) * 20,
      simulationSpeedBoost: 32.4 + (Math.random() - 0.5) * 5,
      activeContributors: 1924 + Math.floor(Math.random() * 100) - 50
    });
  });

  app.get('/api/leaderboard/week', (req, res) => {
    const leaderboard = [
      { 
        id: '1',
        rank: 1, 
        username: 'neural_architect', 
        walletAddress: '7XvQ8K2B9Gh...uM3P',
        flops: 2847392, 
        rewards: 1247.8, 
        gpu: 'RTX 4090',
        hoursContributed: 247.3,
        totalVnsEarned: 2847.92,
        currentStreak: 12,
        contributorRank: 'Visionary',
        isOnline: true
      },
      { 
        id: '2',
        rank: 2, 
        username: 'quantum_dev', 
        walletAddress: '0x742d...9C4f',
        flops: 2195847, 
        rewards: 967.2, 
        gpu: 'RTX 4080',
        hoursContributed: 189.7,
        totalVnsEarned: 2134.58,
        currentStreak: 8,
        contributorRank: 'Architect',
        isOnline: true
      },
      { 
        id: '3',
        rank: 3, 
        username: 'eco_builder', 
        walletAddress: '9B8x...K3mN',
        flops: 1923648, 
        rewards: 845.1, 
        gpu: 'RTX 3080 Ti',
        hoursContributed: 156.2,
        totalVnsEarned: 1789.44,
        currentStreak: 5,
        contributorRank: 'Architect',
        isOnline: false
      },
      { 
        id: '4',
        rank: 4, 
        username: 'solar_optimizer', 
        walletAddress: 'Aa5n...L8pR',
        flops: 1647295, 
        rewards: 723.4, 
        gpu: 'RTX 3070',
        hoursContributed: 134.8,
        totalVnsEarned: 1456.23,
        currentStreak: 7,
        contributorRank: 'Builder',
        isOnline: true
      },
      { 
        id: '5',
        rank: 5, 
        username: 'habitat_designer', 
        walletAddress: 'Zz9w...M2nQ',
        flops: 1398472, 
        rewards: 614.2, 
        gpu: 'RTX 3060 Ti',
        hoursContributed: 98.5,
        totalVnsEarned: 1123.87,
        currentStreak: 3,
        contributorRank: 'Builder',
        isOnline: false
      }
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
