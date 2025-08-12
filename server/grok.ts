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

    // Real decision interactions based on agent roles
    const DECISION_CONTEXTS = {
      'alpha-beta': 'District expansion power source - local renewable vs central grid integration',
      'alpha-delta': 'Biodiversity corridor preservation in new construction zones',
      'alpha-iota': 'Material surplus verification for habitat module construction',
      'alpha-kappa': 'Architecture reflecting resource-based economic values',
      'beta-gamma': 'Peak energy allocation for vertical farm growing cycles',
      'beta-zeta': 'Emergency power prioritization between transport and residential heating',
      'beta-delta': 'Hydroelectric capacity expansion ecosystem impact assessment',
      'gamma-iota': 'Nutrient cycle optimization for soil regeneration systems',
      'gamma-eta': 'Seasonal nutrition planning to prevent deficiencies',
      'gamma-delta': 'Urban pollinator habitat maintenance protocols',
      'delta-alpha': 'Wildlife corridor integration in infrastructure planning',
      'delta-beta': 'Low-impact renewable installation site selection',
      'delta-zeta': 'Transit route design minimizing habitat fragmentation',
      'epsilon-alpha': 'Community space design fostering human connection',
      'epsilon-theta': 'AI governance transparency in public education',
      'epsilon-kappa': 'Cultural arts programs strengthening community identity',
      'zeta-beta': 'Peak demand power allocation for transport systems',
      'zeta-alpha': 'Transit infrastructure before residential development',
      'zeta-gamma': 'Fresh food distribution route optimization',
      'eta-gamma': 'Nutritional balance coordination across food systems',
      'eta-beta': 'Medical facility priority power during grid shortages',
      'eta-epsilon': 'Community mental health through environmental design',
      'theta-kappa': 'Venus Project ethics integration in educational curriculum',
      'theta-beta': 'Universal digital access for remote learning systems',
      'theta-eta': 'Life-stage health education program development',
      'iota-alpha': 'Construction approval based on resource surplus analysis',
      'iota-beta': 'Sector energy demand balancing across city systems',
      'iota-gamma': 'Water and nutrient allocation efficiency protocols',
      'kappa-alpha': 'Cultural compatibility review for infrastructure expansion',
      'kappa-beta': 'Long-term environmental protection vs immediate energy needs',
      'kappa-epsilon': 'Participatory governance transparency maintenance'
    };

    const interactionKey = `${fromId}-${toId}` as keyof typeof DECISION_CONTEXTS;
    const reverseKey = `${toId}-${fromId}` as keyof typeof DECISION_CONTEXTS;
    const decisionContext = DECISION_CONTEXTS[interactionKey] || DECISION_CONTEXTS[reverseKey] || 'Resource allocation optimization';

    const prompt = `You are ${fromAgent.name}, the AI agent for ${fromAgent.domain} in The Venus Project's autonomous city council.

Your role: ${fromAgent.personality}

You are coordinating with ${toAgent.name} (${toAgent.domain}) on: ${decisionContext}

Generate a realistic inter-agent message (15-30 words) that:
1. Uses professional AI council communication style
2. Addresses the specific coordination context
3. Shows your domain expertise and priorities
4. Requests action, data, or proposes a solution

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