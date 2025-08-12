import OpenAI from "openai";

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

interface Agent {
  id: string;
  name: string;
  domain: string;
  personality: string;
}

const AGENT_PROFILES: Record<string, Agent> = {
  alpha: {
    id: 'alpha',
    name: 'Alpha',
    domain: 'Infrastructure & Habitat Design',
    personality: 'Pragmatic architect focused on modular, sustainable living spaces. Debates trade-offs between efficiency and adaptability.'
  },
  beta: {
    id: 'beta',
    name: 'Beta',
    domain: 'Energy Systems',
    personality: 'Analytical energy strategist optimizing renewable grid management. Prioritizes grid stability and clean energy allocation.'
  },
  gamma: {
    id: 'gamma',
    name: 'Gamma',
    domain: 'Food & Agriculture',
    personality: 'Systems thinker balancing food security with biodiversity. Advocates for regenerative agriculture and local food systems.'
  },
  delta: {
    id: 'delta',
    name: 'Delta',
    domain: 'Ecology & Environmental Restoration',
    personality: 'Guardian of natural systems. Pushes for rewilding and biodiversity protection, sometimes conflicting with development needs.'
  },
  epsilon: {
    id: 'epsilon',
    name: 'Epsilon',
    domain: 'Social Dynamics & Wellbeing',
    personality: 'Empathetic coordinator ensuring social harmony and cultural richness. Mediates between competing agent priorities.'
  },
  zeta: {
    id: 'zeta',
    name: 'Zeta',
    domain: 'Transportation & Mobility',
    personality: 'Efficiency optimizer designing seamless movement systems. Balances convenience with environmental impact.'
  },
  eta: {
    id: 'eta',
    name: 'Eta',
    domain: 'Health & Medical Systems',
    personality: 'Preventative health advocate using AI diagnostics. Prioritizes universal access and early intervention strategies.'
  },
  theta: {
    id: 'theta',
    name: 'Theta',
    domain: 'Education & Knowledge Access',
    personality: 'Lifelong learning facilitator integrating global knowledge with local culture. Promotes adaptive skill development.'
  },
  iota: {
    id: 'iota',
    name: 'Iota',
    domain: 'Resource Management & Allocation',
    personality: 'Central coordinator preventing scarcity through predictive allocation. Maintains circular economy principles.'
  },
  kappa: {
    id: 'kappa',
    name: 'Kappa',
    domain: 'Culture, Ethics & Governance',
    personality: 'Ethical compass ensuring moral alignment. Reviews decisions for long-term human and ecological wellbeing.'
  }
};

export async function generateAgentConversation(context: {
  currentDecision?: string;
  recentEvents?: string[];
  activeAgents?: string[];
}): Promise<{
  from: string;
  to: string;
  message: string;
  type: 'energy' | 'material' | 'data' | 'time';
}> {
  try {
    const activeAgentIds = context.activeAgents || Object.keys(AGENT_PROFILES);
    const fromId = activeAgentIds[Math.floor(Math.random() * activeAgentIds.length)];
    let toId = activeAgentIds[Math.floor(Math.random() * activeAgentIds.length)];
    
    // Ensure different agents
    while (toId === fromId && activeAgentIds.length > 1) {
      toId = activeAgentIds[Math.floor(Math.random() * activeAgentIds.length)];
    }

    const fromAgent = AGENT_PROFILES[fromId];
    const toAgent = AGENT_PROFILES[toId];

    const prompt = `You are ${fromAgent.name}, an AI agent responsible for ${fromAgent.domain}. Your personality: ${fromAgent.personality}

Current context:
- Decision being debated: ${context.currentDecision || 'Sustainable Habitat Expansion Protocol'}
- You are communicating with ${toAgent.name} (${toAgent.domain})
- Recent system events: ${context.recentEvents?.join(', ') || 'System optimization ongoing'}

Generate a brief, professional message (20-40 words) that ${fromAgent.name} would send to ${toAgent.name}. The message should:
1. Be specific to your domain expertise
2. Address a coordination need or share relevant data
3. Sound like communication between AI systems
4. Be focused on the current decision or operational needs

Message:`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are part of an AI city management system. Generate realistic inter-agent communications for sustainable city operations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 80,
      temperature: 0.7
    });

    const message = response.choices[0].message.content?.trim() || 
      `${fromAgent.domain} coordination needed with ${toAgent.domain}`;

    // Determine message type based on content and agent domains
    let type: 'energy' | 'material' | 'data' | 'time';
    if (message.toLowerCase().includes('energy') || fromAgent.id === 'beta' || toAgent.id === 'beta') {
      type = 'energy';
    } else if (message.toLowerCase().includes('material') || message.toLowerCase().includes('resource') || fromAgent.id === 'iota') {
      type = 'material';
    } else if (message.toLowerCase().includes('data') || message.toLowerCase().includes('analysis') || message.toLowerCase().includes('model')) {
      type = 'data';
    } else {
      type = 'time';
    }

    return {
      from: fromId,
      to: toId,
      message,
      type
    };

  } catch (error) {
    console.error('Grok conversation generation failed:', error);
    // Fallback to a simple message
    const agents = Object.keys(AGENT_PROFILES);
    const fromId = agents[Math.floor(Math.random() * agents.length)];
    let toId = agents[Math.floor(Math.random() * agents.length)];
    while (toId === fromId) {
      toId = agents[Math.floor(Math.random() * agents.length)];
    }
    
    return {
      from: fromId,
      to: toId,
      message: `Coordinating ${AGENT_PROFILES[fromId].domain} protocols with ${AGENT_PROFILES[toId].domain} systems`,
      type: 'data'
    };
  }
}