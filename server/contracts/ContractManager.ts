// Contract Manager - Orchestrates all 10 Agent Smart Contracts
import { AlphaContract } from './AlphaContract';
import { BetaContract } from './BetaContract';
import { GammaContract } from './GammaContract';
import { DeltaContract } from './DeltaContract';
import { EpsilonContract } from './EpsilonContract';
import { ZetaContract } from './ZetaContract';
import { EtaContract } from './EtaContract';
import { ThetaContract } from './ThetaContract';
import { IotaContract } from './IotaContract';
import { KappaContract } from './KappaContract';
import { ContractEvent, Proposal, AGENT_DOMAINS } from '../../shared/contracts';

export class ContractManager {
  private contracts: Map<string, any> = new Map();
  private crossContractEvents: ContractEvent[] = [];
  private proposalCoordination: Map<string, any> = new Map();

  constructor() {
    // Initialize all 10 agent contracts
    this.contracts.set('alpha', new AlphaContract());   // Infrastructure
    this.contracts.set('beta', new BetaContract());     // Energy
    this.contracts.set('gamma', new GammaContract());   // Food & Agriculture
    this.contracts.set('delta', new DeltaContract());   // Ecology
    this.contracts.set('epsilon', new EpsilonContract()); // Social & Wellbeing
    this.contracts.set('zeta', new ZetaContract());     // Transportation
    this.contracts.set('eta', new EtaContract());       // Health & Medical
    this.contracts.set('theta', new ThetaContract());   // Education
    this.contracts.set('iota', new IotaContract());     // Resource Management
    this.contracts.set('kappa', new KappaContract());   // Ethics & Governance

    console.log('[CONTRACT MANAGER] All 10 agent contracts initialized');
    this.emitSystemEvent('SYSTEM_INITIALIZED', 'All 10 agent smart contracts deployed and active');
  }

  // Cross-contract coordination methods
  async processProposalLifecycle(proposal_id: string, domain: string): Promise<void> {
    const proposal = await this.getProposal(domain, proposal_id);
    if (!proposal) throw new Error('Proposal not found');

    this.proposalCoordination.set(proposal_id, {
      proposal_id,
      domain,
      status: 'reviewing',
      attestations: {},
      started_at: Date.now()
    });

    // Step 1: Ecology attestation (required for all proposals)
    const deltaContract = this.contracts.get('delta') as DeltaContract;
    await deltaContract.attest_ecology(proposal_id, this.calculateEcologicalImpact(proposal));

    // Step 2: Social/Equity attestation (required for all proposals)
    const epsilonContract = this.contracts.get('epsilon') as EpsilonContract;
    await epsilonContract.attest_equity(proposal_id, this.calculateGiniDelta(proposal), 'access-map-uri');

    // Step 3: Domain-specific peer attestations
    await this.requestPeerAttestations(proposal, domain);

    // Step 4: Ethics oversight (Kappa)
    const kappaContract = this.contracts.get('kappa') as KappaContract;
    await kappaContract.attest_ethics(proposal_id, 'compliance-uri');

    this.emitSystemEvent('PROPOSAL_COORDINATION', 
      `Cross-contract review complete for ${proposal_id}`, 
      { proposal_id, domain }
    );
  }

  async coordinateFaucetRequest(from_domain: string, to_domain: string, resource_type: string, amount: number, duration: number): Promise<string> {
    const fromContract = this.contracts.get(from_domain);
    const toContract = this.contracts.get(to_domain);

    if (!fromContract || !toContract) {
      throw new Error('Invalid domain for faucet coordination');
    }

    // Check if source domain can provide the resource
    const available = await this.checkResourceAvailability(from_domain, resource_type, amount);
    if (!available) {
      throw new Error(`${resource_type} not available from ${from_domain}`);
    }

    // Create coordinated faucet
    const faucet_id = await fromContract.open_faucet(
      `${from_domain}-hub`,
      `${to_domain}-hub`,
      resource_type,
      amount / duration,
      duration
    );

    this.emitSystemEvent('CROSS_DOMAIN_FAUCET', 
      `Faucet ${faucet_id}: ${amount} ${resource_type}/h ${from_domain}→${to_domain} (${duration}h)`,
      { faucet_id, from_domain, to_domain, resource_type, amount, duration }
    );

    return faucet_id;
  }

  async enforceGlobalGuardrails(): Promise<void> {
    // Check Ecology hard constraints
    const deltaContract = this.contracts.get('delta') as DeltaContract;
    const ecology_ok = await deltaContract.assert_thresholds();

    // Check Social equity constraints  
    const epsilonContract = this.contracts.get('epsilon') as EpsilonContract;
    const equity_ok = await epsilonContract.assert_thresholds();

    if (!ecology_ok) {
      await this.escalateToKappa('ECOLOGY_VIOLATION', 'Ecological thresholds exceeded - system intervention required');
    }

    if (!equity_ok) {
      await this.escalateToKappa('EQUITY_VIOLATION', 'Social equity thresholds exceeded - redistribution required');
    }

    this.emitSystemEvent('GUARDRAIL_CHECK', 
      `Global guardrails: Ecology ${ecology_ok ? 'OK' : 'VIOLATION'}, Equity ${equity_ok ? 'OK' : 'VIOLATION'}`,
      { ecology_ok, equity_ok }
    );
  }

  async processStakeAction(domain: string, wallet: string, amount: number, lock_days: number): Promise<void> {
    const contract = this.contracts.get(domain);
    if (!contract) throw new Error('Invalid domain for staking');

    // Process stake through domain contract
    await contract.stake_vpc(wallet, amount, lock_days);

    // Update cross-contract influence metrics
    await this.updateInfluenceMetrics(domain, wallet, amount);

    this.emitSystemEvent('SYSTEM_STAKE', 
      `${amount} VPC staked in ${AGENT_DOMAINS[domain as keyof typeof AGENT_DOMAINS]} by ${wallet}`,
      { domain, wallet, amount, lock_days }
    );
  }

  async getSystemWideEvents(): Promise<ContractEvent[]> {
    const allEvents: ContractEvent[] = [];
    
    // Collect events from all contracts
    for (const [domain, contract] of this.contracts) {
      const contractEvents = contract.getEvents();
      allEvents.push(...contractEvents);
    }

    // Add system coordination events
    allEvents.push(...this.crossContractEvents);

    // Sort by timestamp
    return allEvents.sort((a, b) => a.timestamp - b.timestamp);
  }

  async getAgentContract(domain: string): Promise<any> {
    return this.contracts.get(domain);
  }

  async getAllProposals(): Promise<Proposal[]> {
    const allProposals: Proposal[] = [];
    
    for (const [_, contract] of this.contracts) {
      const proposals = contract.getProposals();
      allProposals.push(...proposals);
    }

    return allProposals;
  }

  async getSystemMetrics(): Promise<any> {
    return {
      total_contracts: this.contracts.size,
      active_proposals: (await this.getAllProposals()).filter(p => p.status === 'pending').length,
      total_events: (await this.getSystemWideEvents()).length,
      domains: Object.keys(AGENT_DOMAINS),
      coordination_active: this.proposalCoordination.size
    };
  }

  // Private coordination methods
  private async getProposal(domain: string, proposal_id: string): Promise<Proposal | null> {
    const contract = this.contracts.get(domain);
    if (!contract) return null;
    
    const proposals = contract.getProposals();
    return proposals.find((p: Proposal) => p.id === proposal_id) || null;
  }

  private calculateEcologicalImpact(proposal: Proposal): number {
    // Mock calculation based on proposal metrics
    return proposal.metrics_claim.eco * 0.1; // Convert to impact score
  }

  private calculateGiniDelta(proposal: Proposal): number {
    // Mock calculation of Gini coefficient impact
    return proposal.metrics_claim.equ * -0.01; // Negative is improvement
  }

  private async requestPeerAttestations(proposal: Proposal, domain: string): Promise<void> {
    // Map of which domains should attest to which proposals
    const peerMaps: Record<string, string[]> = {
      'alpha': ['beta', 'iota'], // Infrastructure needs Energy and Resources
      'beta': ['alpha', 'delta'], // Energy needs Infrastructure and Ecology
      'gamma': ['delta', 'epsilon'], // Agriculture needs Ecology and Social
      'delta': [], // Ecology attests to others, not vice versa
      'epsilon': [], // Social attests to others, not vice versa  
      'zeta': ['beta', 'delta'], // Transport needs Energy and Ecology
      'eta': ['beta', 'epsilon'], // Health needs Energy and Social
      'theta': ['epsilon', 'iota'], // Education needs Social and Resources
      'iota': ['delta'], // Resources need Ecology approval
      'kappa': [] // Ethics oversees all, not attested by others
    };

    const peers = peerMaps[domain] || [];
    
    for (const peerDomain of peers) {
      const peerContract = this.contracts.get(peerDomain);
      if (peerContract) {
        await peerContract.attest_proposal(proposal.id, 'approve', 'peer-review-hash');
      }
    }
  }

  private async checkResourceAvailability(domain: string, resource_type: string, amount: number): Promise<boolean> {
    // Mock resource availability check
    const resourceMap: Record<string, string[]> = {
      'beta': ['kWh', 'energy'],
      'gamma': ['L', 'food', 'nutrients'],
      'iota': ['kg', 'materials', 'aluminum', 'steel'],
      'theta': ['MB', 'compute-hours', 'bandwidth']
    };

    const availableResources = resourceMap[domain] || [];
    return availableResources.includes(resource_type);
  }

  private async updateInfluenceMetrics(domain: string, wallet: string, amount: number): Promise<void> {
    // Mock influence calculation - in real implementation would update influence scores
    const influence_boost = amount * 0.001;
    
    this.emitSystemEvent('INFLUENCE_UPDATED', 
      `Influence metrics updated: ${wallet} gains ${influence_boost.toFixed(3)} influence in ${domain}`,
      { domain, wallet, influence_boost }
    );
  }

  private async escalateToKappa(violation_type: string, message: string): Promise<void> {
    const kappaContract = this.contracts.get('kappa') as KappaContract;
    
    // Create emergency governance intervention
    const intervention_id = `intervention-${Date.now()}`;
    
    this.emitSystemEvent('GOVERNANCE_ESCALATION', 
      `KAPPA INTERVENTION ${violation_type}: ${message}`,
      { violation_type, intervention_id }
    );
  }

  private emitSystemEvent(event_type: string, message: string, data?: Record<string, any>): void {
    const event: ContractEvent = {
      timestamp: Date.now(),
      domain: 'system' as any, // System-level events
      event_type,
      message,
      data
    };
    
    this.crossContractEvents.push(event);
    console.log(`[CONTRACT SYSTEM] ${message}`, data);
  }
}

// Singleton instance
export const contractManager = new ContractManager();