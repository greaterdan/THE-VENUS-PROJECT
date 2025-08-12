// Energy Systems (BETA) Smart Contract
import { BaseAgentContract, Faucet, Proposal, ContractEvent } from '../../shared/contracts';

export class BetaContract implements BaseAgentContract {
  private domain = 'beta' as const;
  private energyFaucets: Map<string, Faucet> = new Map();
  private storageMetadata: Map<string, any> = new Map();
  private generationAssets: Map<string, any> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private events: ContractEvent[] = [];

  // Domain-specific state
  private reserveMarginMin = 0.15; // 15% minimum reserve
  private renewableTargetMin = 0.85; // 85% renewable minimum
  private gridCapacity = 10000; // kWh total capacity

  // Energy-specific instructions
  async propose_energy_allocation(params: {
    from: string,
    to: string,
    rate: number, // kWh/hour
    duration: number // hours
  }): Promise<string> {
    const proposal_id = `energy-alloc-${Date.now()}`;
    
    const proposal: Proposal = {
      id: proposal_id,
      domain: this.domain,
      author: 'system',
      changes: [{ type: 'energy_allocation', ...params }],
      metrics_claim: {
        eco: 0.5,
        well: 1.0,
        eff: 2.5,
        res: 2.0,
        equ: 0.8,
        inn: 1.2
      },
      rationale_hash: `energy-alloc-${params.rate}-${params.duration}`,
      status: 'pending',
      quorum_req: 2,
      created_at: Date.now(),
      expires_at: Date.now() + (2 * 24 * 60 * 60 * 1000) // 2 days
    };

    this.proposals.set(proposal_id, proposal);
    
    await this.emit_event('ENERGY_ALLOCATION_PROPOSED', 
      `Energy allocation: ${params.rate} kWh/h ${params.from}→${params.to} for ${params.duration}h`,
      { proposal_id, ...params }
    );

    return proposal_id;
  }

  async attest_grid_stability(n_minus_1: boolean, reserve_margin: number): Promise<void> {
    const stable = n_minus_1 && reserve_margin >= this.reserveMarginMin;
    
    await this.emit_event('GRID_STABILITY_ATTESTED', 
      `Grid stability: ${stable ? 'STABLE' : 'UNSTABLE'} (Reserve: ${(reserve_margin * 100).toFixed(1)}%)`,
      { n_minus_1, reserve_margin, stable }
    );

    if (!stable) {
      await this.emit_event('EVT_GRID_ALERT', 
        'Grid stability compromised - scaling back allocations',
        { reserve_margin }
      );
    }
  }

  async enact_allocation(proposal_id: string): Promise<void> {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal || proposal.status !== 'pending') {
      throw new Error('Invalid proposal for enactment');
    }

    const allocationChange = proposal.changes.find(c => c.type === 'energy_allocation');
    if (!allocationChange) throw new Error('No allocation specification in proposal');

    // Check guardrails
    if (!await this.validateReserveMargin()) {
      throw new Error('Reserve margin requirements not met');
    }
    if (!await this.validateRenewableShare()) {
      throw new Error('Renewable share targets not met');
    }

    // Open energy faucet
    const faucet_id = await this.open_faucet(
      allocationChange.from,
      allocationChange.to,
      'kWh',
      allocationChange.rate,
      allocationChange.duration
    );

    proposal.status = 'enacted';

    await this.emit_event('EVT_POWER_FLOW_OPENED', 
      `Power flow opened: ${allocationChange.rate} kWh/h ${allocationChange.from}→${allocationChange.to}`,
      { faucet_id, proposal_id }
    );
  }

  async register_generation(asset_id: string, capacity_profile_uri: string): Promise<void> {
    this.generationAssets.set(asset_id, {
      asset_id,
      capacity_profile_uri,
      registered_at: Date.now(),
      status: 'active'
    });

    await this.emit_event('GENERATION_ASSET_REGISTERED', 
      `Generation asset registered: ${asset_id}`,
      { asset_id, capacity_profile_uri }
    );
  }

  private async validateReserveMargin(): Promise<boolean> {
    // Calculate current reserve margin
    const currentReserve = 0.18; // Mock calculation
    return currentReserve >= this.reserveMarginMin;
  }

  private async validateRenewableShare(): Promise<boolean> {
    // Calculate renewable percentage
    const renewableShare = 0.87; // Mock calculation
    return renewableShare >= this.renewableTargetMin;
  }

  async scale_energy_grid(factor: number): Promise<void> {
    // Scale all active faucets
    for (const [faucet_id, faucet] of this.energyFaucets) {
      if (faucet.status === 'active') {
        const new_rate = faucet.current_rate * factor;
        await this.scale_faucet(faucet_id, new_rate);
      }
    }

    await this.emit_event('GRID_SCALED', 
      `Grid scaled by factor ${factor}`,
      { scale_factor: factor }
    );
  }

  // Base contract interface implementations
  async create_proposal(author: string, changes: any[], metrics_claim: Proposal['metrics_claim'], rationale_hash: string): Promise<string> {
    const proposal_id = `beta-${Date.now()}`;
    
    const proposal: Proposal = {
      id: proposal_id,
      domain: this.domain,
      author,
      changes,
      metrics_claim,
      rationale_hash,
      status: 'pending',
      quorum_req: 2,
      created_at: Date.now(),
      expires_at: Date.now() + (3 * 24 * 60 * 60 * 1000)
    };

    this.proposals.set(proposal_id, proposal);
    await this.emit_event('PROPOSAL_CREATED', `New energy proposal ${proposal_id}`, { proposal_id });
    return proposal_id;
  }

  async attest_proposal(proposal_id: string, vote: 'approve' | 'reject' | 'abstain', note_hash: string): Promise<void> {
    await this.emit_event('PROPOSAL_ATTESTED', 
      `Energy proposal ${proposal_id} attested: ${vote}`,
      { proposal_id, vote, note_hash }
    );
  }

  async enact_proposal(proposal_id: string): Promise<void> {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal) throw new Error('Proposal not found');
    
    proposal.status = 'enacted';
    await this.emit_event('PROPOSAL_ENACTED', `Energy proposal ${proposal_id} enacted`);
  }

  async rollback_proposal(proposal_id: string): Promise<void> {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal) throw new Error('Proposal not found');
    
    proposal.status = 'rejected';
    await this.emit_event('PROPOSAL_ROLLBACK', `Energy proposal ${proposal_id} rolled back`);
  }

  async open_faucet(from_node: string, to_node: string, rtype: string, max_rate: number, duration: number): Promise<string> {
    const faucet_id = `beta-faucet-${Date.now()}`;
    
    const faucet: Faucet = {
      from_node,
      to_node,
      rtype,
      max_rate,
      current_rate: max_rate,
      opens_at: Date.now(),
      closes_at: Date.now() + (duration * 60 * 60 * 1000),
      policy_ref: `energy-policy-${Date.now()}`,
      status: 'active'
    };

    this.energyFaucets.set(faucet_id, faucet);

    await this.emit_event('EVT_POWER_FLOW_OPENED', 
      `Energy faucet opened: ${max_rate} ${rtype}/h ${from_node}→${to_node} (${duration}h)`,
      { faucet_id, from_node, to_node, max_rate, duration }
    );
    
    return faucet_id;
  }

  async scale_faucet(faucet_id: string, new_rate: number): Promise<void> {
    const faucet = this.energyFaucets.get(faucet_id);
    if (faucet) {
      faucet.current_rate = new_rate;
      await this.emit_event('EVT_POWER_FLOW_SCALED', 
        `Energy faucet ${faucet_id} scaled to ${new_rate} ${faucet.rtype}/h`,
        { faucet_id, new_rate }
      );
    }
  }

  async close_faucet(faucet_id: string): Promise<void> {
    const faucet = this.energyFaucets.get(faucet_id);
    if (faucet) {
      faucet.status = 'closed';
      await this.emit_event('EVT_POWER_FLOW_CLOSED', 
        `Energy faucet ${faucet_id} closed`,
        { faucet_id }
      );
    }
  }

  async stake_vpc(wallet: string, amount: number, lock_days: number): Promise<void> {
    await this.emit_event('ENERGY_STAKING', 
      `+${amount} VPC staked in Energy | Lock: ${lock_days}d | Efficiency: +${(amount * 0.001).toFixed(1)}`,
      { wallet, amount, lock_days, efficiency_boost: amount * 0.001 }
    );
  }

  async unstake_vpc(wallet: string, amount: number): Promise<void> {
    await this.emit_event('ENERGY_UNSTAKING', 
      `-${amount} VPC unstaked from Energy`,
      { wallet, amount }
    );
  }

  async issue_ticket(wallet: string, amount: number): Promise<void> {
    await this.emit_event('ENERGY_TICKET_ISSUED', 
      `Energy access ticket: ${amount} to ${wallet}`,
      { wallet, amount }
    );
  }

  async consume_ticket(wallet: string, amount: number): Promise<void> {
    await this.emit_event('ENERGY_TICKET_CONSUMED', 
      `Energy ticket consumed: ${amount} by ${wallet}`,
      { wallet, amount }
    );
  }

  async record_telemetry(metrics: Record<string, number>, sensor_data: Record<string, any>): Promise<void> {
    await this.emit_event('ENERGY_TELEMETRY', 
      `Grid metrics: ${metrics.load_factor || 0.75}% load, ${metrics.renewable_share || 0.85}% renewable`,
      { metrics, sensor_data }
    );
  }

  async assert_thresholds(): Promise<boolean> {
    const reserveOk = await this.validateReserveMargin();
    const renewableOk = await this.validateRenewableShare();
    return reserveOk && renewableOk;
  }

  async emit_event(event_type: string, message: string, data?: Record<string, any>): Promise<void> {
    const event: ContractEvent = {
      timestamp: Date.now(),
      domain: this.domain,
      event_type,
      message,
      data
    };
    
    this.events.push(event);
    console.log(`[BETA CONTRACT] ${message}`, data);
  }

  // Getters
  getEnergyFaucets(): Faucet[] {
    return Array.from(this.energyFaucets.values());
  }

  getGenerationAssets(): any[] {
    return Array.from(this.generationAssets.values());
  }

  getProposals(): Proposal[] {
    return Array.from(this.proposals.values());
  }

  getEvents(): ContractEvent[] {
    return this.events;
  }
}