import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAgentConversation } from "./grok";
import DecisionImpactAnalyzer from "./impactAnalyzer";
import ArchiveSnapshotManager from "./archiveSnapshots";
import { AgoraWebSocketServer } from "./websocket";
import { contractManager } from "./contracts/ContractManager";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY
});

// Agent definitions
const AGENTS = [
  { id: 'alpha', name: 'ALPHA', domain: 'Infrastructure Habitat Design', alignment: 94 },
  { id: 'beta', name: 'BETA', domain: 'Energy Resource Management', alignment: 91 },
  { id: 'gamma', name: 'GAMMA', domain: 'Agricultural Systems', alignment: 89 },
  { id: 'delta', name: 'DELTA', domain: 'Ecological Integration', alignment: 96 },
  { id: 'epsilon', name: 'EPSILON', domain: 'Social Coordination', alignment: 87 },
  { id: 'zeta', name: 'ZETA', domain: 'Transportation Networks', alignment: 93 },
  { id: 'eta', name: 'ETA', domain: 'Health Systems', alignment: 92 },
  { id: 'theta', name: 'THETA', domain: 'Education & Knowledge', alignment: 88 },
  { id: 'iota', name: 'IOTA', domain: 'Resource Allocation', alignment: 90 },
  { id: 'kappa', name: 'KAPPA', domain: 'Ethics & Governance', alignment: 95 }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Impact Analyzer and Archive Manager
  const impactAnalyzer = new DecisionImpactAnalyzer();
  const archiveManager = new ArchiveSnapshotManager();
  const sseClients = new Set<any>();
  
  // Start idle drift timer (every 10 seconds)
  setInterval(() => {
    const metrics = impactAnalyzer.applyIdleDrift();
    broadcastMetrics(metrics);
  }, 10000);
  
  function broadcastMetrics(metrics: any) {
    const data = JSON.stringify(metrics);
    sseClients.forEach(client => {
      try {
        client.write(`data: ${data}\n\n`);
      } catch (error) {
        sseClients.delete(client);
      }
    });
  }
  // Grok-powered AI agent conversation endpoint
  app.get('/api/agent-conversation', async (req, res) => {
    try {
      const conversation = await generateAgentConversation({
        currentDecision: 'Sustainable Habitat Expansion Protocol',
        recentEvents: ['Grid optimization complete', 'Biodiversity assessment updated', 'Resource allocation adjusted'],
        activeAgents: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']
      });
      
      // Add message to archive manager for snapshot processing
      if (conversation.from && conversation.message) {
        archiveManager.addMessage({
          id: `msg-${Date.now()}`,
          from: conversation.from,
          to: conversation.to || 'system',
          message: conversation.message,
          timestamp: new Date(),
          type: conversation.type || 'data'
        });
      }
      
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

  // Decision Impact Analysis endpoints
  app.post('/api/chat', (req, res) => {
    try {
      const { agent, text } = req.body;
      
      if (!agent || !text) {
        return res.status(400).json({ error: 'Missing agent or text' });
      }

      const result = impactAnalyzer.processMessage({ agent, text });
      impactAnalyzer.logProcessing({ agent, text }, result);
      
      // Broadcast updated metrics to all SSE clients
      broadcastMetrics(result.newMetrics);
      
      res.json({
        success: true,
        deltas: result.deltas,
        metrics: result.newMetrics,
        keywords: result.keywords
      });
    } catch (error) {
      console.error('Error processing chat message:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  });

  app.get('/api/impact', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send current metrics immediately
    const currentMetrics = impactAnalyzer.getCurrentMetrics();
    res.write(`data: ${JSON.stringify(currentMetrics)}\n\n`);
    
    // Add client to SSE list
    sseClients.add(res);
    
    // Clean up on client disconnect
    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // Test endpoint with sample messages
  app.post('/api/test-impact', (req, res) => {
    const sampleMessages = [
      { agent: 'beta', text: 'Implementing renewable energy grid optimization with solar panel efficiency boost' },
      { agent: 'gamma', text: 'Initiating rewilding project to restore biodiversity and ecosystem health' },
      { agent: 'eta', text: 'Upgrading accessibility features for inclusive community participation' },
      { agent: 'alpha', text: 'Phase out diesel generators completely, replacing with clean energy systems' },
      { agent: 'delta', text: 'Expanding organic food production to improve nutrition and wellbeing' }
    ];
    
    const results = sampleMessages.map(msg => {
      const result = impactAnalyzer.processMessage(msg);
      impactAnalyzer.logProcessing(msg, result);
      return { message: msg, result };
    });
    
    // Broadcast final metrics
    broadcastMetrics(impactAnalyzer.getCurrentMetrics());
    
    res.json({ 
      testResults: results,
      finalMetrics: impactAnalyzer.getCurrentMetrics()
    });
  });

  // Archive snapshot endpoints
  app.get('/api/archive/snapshots', (req, res) => {
    try {
      const headers = archiveManager.getSnapshotHeaders();
      res.json(headers);
    } catch (error) {
      console.error('Error fetching archive snapshots:', error);
      res.status(500).json({ error: 'Failed to fetch snapshots' });
    }
  });

  app.get('/api/archive/transcript/:id', (req, res) => {
    try {
      const snapshotData = archiveManager.getSnapshotTranscript(req.params.id);
      if (!snapshotData) {
        return res.status(404).json({ error: 'Transcript not found' });
      }
      res.json(snapshotData);
    } catch (error) {
      console.error('Error fetching transcript:', error);
      res.status(500).json({ error: 'Failed to fetch transcript' });
    }
  });

  // Enhanced archive search endpoint
  app.get('/api/archive/search', (req, res) => {
    try {
      const query = req.query.q as string || '';
      const results = archiveManager.searchSnapshots(query);
      res.json(results);
    } catch (error) {
      console.error('Error searching archive:', error);
      res.status(500).json({ error: 'Failed to search archive' });
    }
  });

  // Individual agent chat endpoint
  app.post('/api/agent-chat', async (req, res) => {
    try {
      const { agentId, message, userId = 'user' } = req.body;
      
      if (!agentId || !message) {
        return res.status(400).json({ error: 'Agent ID and message are required' });
      }

      // Get agent details
      const agent = AGENTS.find((a: any) => a.id === agentId);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      // Create agent-specific system prompt
      const systemPrompt = `You are Agent ${agent.name}, a specialized AI agent in The Venus Project's decision-making council.

Your specialization: ${agent.domain}
Your role: Expert in ${agent.domain.toLowerCase()}
Your alignment score: ${agent.alignment}%

You communicate in a professional, analytical manner befitting a council member responsible for ${agent.domain.toLowerCase()}. Focus on:
- Resource optimization and allocation
- Sustainable decision-making
- Collaborative problem-solving
- Evidence-based recommendations

Respond as this specific agent would, considering your domain expertise and the collaborative nature of the council. Keep responses concise but informative.`;

      // Send to Grok API
      const response = await openai.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const agentResponse = response.choices[0].message.content;

      res.json({
        success: true,
        response: agentResponse,
        agent: {
          id: agentId,
          name: agent.name,
          domain: agent.domain
        }
      });

    } catch (error: any) {
      console.error('Error in agent chat:', error);
      res.status(500).json({ 
        error: 'Failed to process agent chat',
        message: error.message || 'Unknown error occurred'
      });
    }
  });

  // Smart Contract Endpoints
  
  // Get contract events for all agents
  app.get('/api/contracts/events', async (req, res) => {
    try {
      const events = await contractManager.getSystemWideEvents();
      res.json(events);
    } catch (error) {
      console.error('Error fetching contract events:', error);
      res.status(500).json({ error: 'Failed to fetch contract events' });
    }
  });

  // Get all proposals across agents
  app.get('/api/contracts/proposals', async (req, res) => {
    try {
      const proposals = await contractManager.getAllProposals();
      res.json(proposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  });

  // Get system metrics
  app.get('/api/contracts/metrics', async (req, res) => {
    try {
      const metrics = await contractManager.getSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
  });

  // Process staking action
  app.post('/api/contracts/stake', async (req, res) => {
    try {
      const { domain, wallet, amount, lock_days } = req.body;
      
      if (!domain || !wallet || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await contractManager.processStakeAction(domain, wallet, amount, lock_days || 30);
      
      res.json({ 
        success: true, 
        message: `${amount} VPC staked in ${domain}`,
        domain,
        amount,
        lock_days: lock_days || 30
      });
    } catch (error) {
      console.error('Error processing stake:', error);
      res.status(500).json({ error: 'Failed to process stake action' });
    }
  });

  // Create a new proposal 
  app.post('/api/contracts/proposals', async (req, res) => {
    try {
      const { domain, author, changes, metrics_claim, rationale_hash } = req.body;
      
      if (!domain || !author || !changes || !metrics_claim || !rationale_hash) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const contract = await contractManager.getAgentContract(domain);
      if (!contract) {
        return res.status(400).json({ error: 'Invalid domain' });
      }

      const proposal_id = await contract.create_proposal(author, changes, metrics_claim, rationale_hash);
      
      // Start cross-contract coordination
      await contractManager.processProposalLifecycle(proposal_id, domain);

      res.json({ 
        success: true, 
        proposal_id,
        domain,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  });

  // Attest to a proposal
  app.post('/api/contracts/proposals/:proposal_id/attest', async (req, res) => {
    try {
      const { proposal_id } = req.params;
      const { domain, vote, note_hash } = req.body;
      
      if (!domain || !vote || !note_hash) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const contract = await contractManager.getAgentContract(domain);
      if (!contract) {
        return res.status(400).json({ error: 'Invalid domain' });
      }

      await contract.attest_proposal(proposal_id, vote, note_hash);

      res.json({ 
        success: true, 
        proposal_id,
        domain,
        vote
      });
    } catch (error) {
      console.error('Error attesting proposal:', error);
      res.status(500).json({ error: 'Failed to attest proposal' });
    }
  });

  // Coordinate resource faucet between domains
  app.post('/api/contracts/faucets', async (req, res) => {
    try {
      const { from_domain, to_domain, resource_type, amount, duration } = req.body;
      
      if (!from_domain || !to_domain || !resource_type || !amount || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const faucet_id = await contractManager.coordinateFaucetRequest(
        from_domain, 
        to_domain, 
        resource_type, 
        amount, 
        duration
      );

      res.json({ 
        success: true, 
        faucet_id,
        from_domain,
        to_domain,
        resource_type,
        amount,
        duration
      });
    } catch (error) {
      console.error('Error coordinating faucet:', error);
      res.status(500).json({ error: error.message || 'Failed to coordinate faucet' });
    }
  });

  // Get specific agent contract state
  app.get('/api/contracts/:domain', async (req, res) => {
    try {
      const { domain } = req.params;
      const contract = await contractManager.getAgentContract(domain);
      
      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      const state = {
        domain,
        proposals: contract.getProposals(),
        events: contract.getEvents(),
        // Add domain-specific state
        ...(domain === 'alpha' && { cityNodes: contract.getCityNodes() }),
        ...(domain === 'beta' && { energyFaucets: contract.getEnergyFaucets() }),
        ...(domain === 'gamma' && { harvestRecords: contract.getHarvestRecords() }),
        ...(domain === 'delta' && { thresholds: Array.from(contract.getThresholds().entries()) }),
        ...(domain === 'epsilon' && { 
          wellbeingMetrics: Array.from(contract.getWellbeingMetrics().entries()),
          equityIndices: Array.from(contract.getEquityIndices().entries())
        }),
        ...(domain === 'eta' && { 
          outcomes: contract.getOutcomes(),
          facilities: contract.getFacilities()
        }),
        ...(domain === 'theta' && { 
          learningGains: contract.getLearningGains(),
          campaigns: contract.getCampaigns()
        }),
        ...(domain === 'iota' && { 
          inventory: contract.getInventory(),
          recyclingRecords: contract.getRecyclingRecords()
        }),
        ...(domain === 'kappa' && { 
          ethicalRules: contract.getEthicalRules(),
          violations: contract.getViolations()
        })
      };

      res.json(state);
    } catch (error) {
      console.error('Error fetching contract state:', error);
      res.status(500).json({ error: 'Failed to fetch contract state' });
    }
  });

  // Enforce global guardrails
  app.post('/api/contracts/guardrails/check', async (req, res) => {
    try {
      await contractManager.enforceGlobalGuardrails();
      res.json({ success: true, message: 'Guardrail check completed' });
    } catch (error) {
      console.error('Error checking guardrails:', error);
      res.status(500).json({ error: 'Failed to check guardrails' });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket server for real-time neural network
  const agoraWS = new AgoraWebSocketServer(httpServer);
  agoraWS.startCleanupInterval();

  return httpServer;
}
