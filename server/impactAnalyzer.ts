interface ChatMessage {
  agent: string;
  text: string;
}

interface Metrics {
  ecological: number;
  wellbeing: number;
  efficiency: number;
  resilience: number;
  equity: number;
  innovation: number;
}

interface KeywordSet {
  positive: { [key: string]: number };
  negative: { [key: string]: number };
}

interface AgentCredibility {
  [agentId: string]: {
    ecological?: number;
    wellbeing?: number;
    efficiency?: number;
    resilience?: number;
    equity?: number;
    innovation?: number;
  };
}

class DecisionImpactAnalyzer {
  private metrics: Metrics;
  private readonly baseline = 75;
  private readonly alpha = 0.7; // Exponential moving average factor

  // Keyword dictionaries with weights
  private readonly keywords: { [key in keyof Metrics]: KeywordSet } = {
    ecological: {
      positive: {
        'rewilding': 3, 'remediation': 2.5, 'renewable': 2, 'sustainable': 1.5, 
        'biodiversity': 2, 'ecosystem': 1.5, 'carbon': 2, 'green': 1, 'solar': 2,
        'wind': 2, 'clean': 1.5, 'organic': 1, 'conservation': 2, 'restoration': 2.5,
        'habitat': 2, 'wildlife': 1.5, 'natural': 1, 'eco-friendly': 2
      },
      negative: {
        'pollution': -2.5, 'diesel': -2, 'fossil': -2.5, 'deforest': -3,
        'toxic': -2, 'waste': -1.5, 'contamination': -2, 'emissions': -2,
        'coal': -2.5, 'oil': -2, 'gas': -1.5, 'chemical': -1.5, 'pesticide': -2
      }
    },
    wellbeing: {
      positive: {
        'health': 2, 'wellness': 2, 'nutrition': 2, 'medical': 1.5, 'care': 1.5,
        'comfort': 1, 'safety': 2, 'security': 1.5, 'happiness': 1.5, 'quality': 1,
        'food': 1.5, 'fresh': 1, 'exercise': 1.5, 'mental': 1.5, 'community': 1.5,
        'social': 1, 'recreational': 1, 'leisure': 1
      },
      negative: {
        'stress': -1.5, 'disease': -2, 'illness': -2, 'danger': -2, 'risk': -1,
        'pollution': -1.5, 'noise': -1, 'overcrowding': -1.5, 'isolation': -1.5,
        'shortage': -2, 'malnutrition': -2.5, 'unsafe': -2
      }
    },
    efficiency: {
      positive: {
        'optimize': 2.5, 'streamline': 2, 'automate': 2, 'efficient': 2, 'fast': 1.5,
        'productive': 2, 'smart': 1.5, 'automated': 2, 'digital': 1, 'algorithm': 1.5,
        'ai': 2, 'machine': 1.5, 'system': 1, 'network': 1, 'integration': 1.5,
        'coordination': 1.5, 'synchronize': 2
      },
      negative: {
        'slow': -1.5, 'delay': -2, 'bottleneck': -2, 'inefficient': -2.5,
        'waste': -2, 'redundant': -2, 'manual': -1, 'fragmented': -1.5,
        'disconnect': -2, 'malfunction': -2.5
      }
    },
    resilience: {
      positive: {
        'backup': 2, 'redundancy': 2.5, 'robust': 2, 'durable': 2, 'flexible': 1.5,
        'adaptive': 2, 'resilient': 2.5, 'stable': 1.5, 'reliable': 2, 'secure': 2,
        'emergency': 1.5, 'preparedness': 2, 'contingency': 2, 'disaster': 1.5,
        'recovery': 2, 'strengthen': 2
      },
      negative: {
        'vulnerable': -2, 'fragile': -2, 'failure': -2.5, 'collapse': -3,
        'unstable': -2, 'weak': -1.5, 'brittle': -2, 'dependent': -1,
        'single': -1.5, 'centralized': -1
      }
    },
    equity: {
      positive: {
        'fair': 2, 'equal': 2, 'inclusive': 2.5, 'accessible': 2, 'diverse': 1.5,
        'justice': 2.5, 'opportunity': 1.5, 'community': 1.5, 'sharing': 1.5,
        'universal': 2, 'public': 1, 'democratic': 1.5, 'participation': 1.5,
        'affordable': 2, 'free': 1.5
      },
      negative: {
        'exclusive': -2, 'discrimination': -2.5, 'inequality': -2.5, 'bias': -2,
        'privilege': -1.5, 'segregation': -2.5, 'barrier': -2, 'expensive': -1.5,
        'restricted': -2, 'limited': -1
      }
    },
    innovation: {
      positive: {
        'innovation': 2.5, 'creative': 2, 'research': 2, 'development': 2, 'experiment': 2,
        'breakthrough': 2.5, 'advance': 2, 'cutting-edge': 2.5, 'novel': 2,
        'prototype': 2, 'design': 1.5, 'invention': 2.5, 'technology': 1.5,
        'learning': 1.5, 'education': 2, 'knowledge': 1.5, 'discovery': 2
      },
      negative: {
        'outdated': -2, 'obsolete': -2.5, 'stagnant': -2, 'traditional': -1,
        'conservative': -1, 'rigid': -1.5, 'backward': -2
      }
    }
  };

  // Context verbs that modify keyword weights
  private readonly contextModifiers = {
    amplify: ['increase', 'expand', 'boost', 'enhance', 'improve', 'grow', 'scale'],
    invert: ['reduce', 'cut', 'eliminate', 'decrease', 'lower', 'minimize'],
    strong: ['phase out', 'completely', 'fully', 'entirely', 'dramatically']
  };

  // Agent credibility multipliers
  private readonly agentCredibility: AgentCredibility = {
    'alpha': { resilience: 1.2, efficiency: 1.15 }, // Infrastructure & Habitat Design
    'beta': { efficiency: 1.2, ecological: 1.1 }, // Energy Systems
    'gamma': { ecological: 1.2, resilience: 1.1 }, // Environmental Management
    'delta': { wellbeing: 1.2, equity: 1.15 }, // Food Systems
    'epsilon': { efficiency: 1.15, resilience: 1.15 }, // Transportation
    'zeta': { wellbeing: 1.2 }, // Health Systems
    'eta': { innovation: 1.2, equity: 1.15 }, // Education
    'theta': { resilience: 1.2, efficiency: 1.15 }, // Infrastructure
    'iota': { equity: 1.2, efficiency: 1.15 }, // Resource Management
    'kappa': { equity: 1.15, ecological: 1.1 } // Culture & Community
  };

  constructor(initialMetrics?: Partial<Metrics>) {
    this.metrics = {
      ecological: 78,
      wellbeing: 82,
      efficiency: 74,
      resilience: 71,
      equity: 79,
      innovation: 76,
      ...initialMetrics
    };
  }

  processMessage(message: ChatMessage): { deltas: Metrics; newMetrics: Metrics; keywords: any } {
    const text = message.text.toLowerCase();
    const words = this.tokenize(text);
    
    // Find context modifiers
    const hasAmplify = this.contextModifiers.amplify.some(verb => text.includes(verb));
    const hasInvert = this.contextModifiers.invert.some(verb => text.includes(verb));
    const hasStrong = this.contextModifiers.strong.some(verb => text.includes(verb));
    
    const extractedKeywords: any = {};
    const rawDeltas: Metrics = {
      ecological: 0,
      wellbeing: 0,
      efficiency: 0,
      resilience: 0,
      equity: 0,
      innovation: 0
    };

    // Process each metric
    Object.keys(this.keywords).forEach(metricKey => {
      const metric = metricKey as keyof Metrics;
      const keywordSet = this.keywords[metric];
      extractedKeywords[metric] = { positive: [], negative: [] };
      
      words.forEach(word => {
        if (keywordSet.positive[word]) {
          extractedKeywords[metric].positive.push({ word, weight: keywordSet.positive[word] });
          let delta = keywordSet.positive[word];
          
          // Apply context modifiers
          if (hasAmplify) delta *= 1.3;
          if (hasStrong) delta *= 1.5;
          
          rawDeltas[metric] += delta;
        }
        
        if (keywordSet.negative[word]) {
          extractedKeywords[metric].negative.push({ word, weight: keywordSet.negative[word] });
          let delta = keywordSet.negative[word];
          
          // Apply context modifiers
          if (hasInvert) delta *= -1; // Inverting negative makes it positive
          if (hasAmplify && !hasInvert) delta *= 1.3;
          if (hasStrong) delta *= 1.5;
          
          rawDeltas[metric] += delta;
        }
      });
    });

    // Apply agent credibility multipliers
    const credibility = this.agentCredibility[message.agent] || {};
    Object.keys(credibility).forEach(metricKey => {
      const metric = metricKey as keyof Metrics;
      const multiplier = credibility[metric] || 1;
      rawDeltas[metric] *= multiplier;
    });

    // Clamp deltas to [-3, +3] range
    const clampedDeltas: Metrics = {} as Metrics;
    Object.keys(rawDeltas).forEach(metricKey => {
      const metric = metricKey as keyof Metrics;
      clampedDeltas[metric] = Math.max(-3, Math.min(3, rawDeltas[metric]));
    });

    // Apply exponential moving average and update metrics
    const newMetrics: Metrics = {} as Metrics;
    Object.keys(this.metrics).forEach(metricKey => {
      const metric = metricKey as keyof Metrics;
      const currentValue = this.metrics[metric];
      const targetValue = Math.max(0, Math.min(100, currentValue + clampedDeltas[metric]));
      
      // Exponential moving average for smooth transitions
      newMetrics[metric] = this.alpha * targetValue + (1 - this.alpha) * currentValue;
      
      // Ensure bounds
      newMetrics[metric] = Math.max(0, Math.min(100, newMetrics[metric]));
    });

    this.metrics = newMetrics;

    return {
      deltas: clampedDeltas,
      newMetrics: { ...this.metrics },
      keywords: extractedKeywords
    };
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  applyIdleDrift(): Metrics {
    const driftRate = 0.02; // 2% drift toward baseline every tick
    
    Object.keys(this.metrics).forEach(metricKey => {
      const metric = metricKey as keyof Metrics;
      const currentValue = this.metrics[metric];
      const drift = (this.baseline - currentValue) * driftRate;
      this.metrics[metric] = Math.max(0, Math.min(100, currentValue + drift));
    });

    return { ...this.metrics };
  }

  getCurrentMetrics(): Metrics {
    return { ...this.metrics };
  }

  logProcessing(message: ChatMessage, result: any): void {
    console.log(`[IMPACT ANALYZER] Agent: ${message.agent}`);
    console.log(`[IMPACT ANALYZER] Message: "${message.text}"`);
    console.log(`[IMPACT ANALYZER] Keywords:`, result.keywords);
    console.log(`[IMPACT ANALYZER] Deltas:`, result.deltas);
    console.log(`[IMPACT ANALYZER] New Metrics:`, result.newMetrics);
    console.log('---');
  }
}

export default DecisionImpactAnalyzer;