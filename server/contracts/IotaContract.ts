// Resource Management & Allocation (IOTA) Smart Contract
import { BaseAgentContract, Proposal, ContractEvent } from '../../shared/contracts';

export class IotaContract implements BaseAgentContract {
  private domain = 'iota' as const;
  private globalInventory: Map<string, any> = new Map();
  private circularityContracts: Map<string, any> = new Map();
  private materialFaucets: Map<string, any> = new Map();
  private recyclingRecords: Map<string, any> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private events: ContractEvent[] = [];

  constructor() {
    // Initialize sample inventory
    this.globalInventory.set('recycled_aluminum', { stock_kg: 15000, quality: 'A+', location: 'hub_alpha' });
    this.globalInventory.set('reclaimed_steel', { stock_kg: 8500, quality: 'A', location: 'hub_beta' });
    this.globalInventory.set('bio_composite', { stock_kg: 3200, quality: 'A+', location: 'hub_gamma' });
  }

  // Resource Management specific instructions
  async register_material(stock_kg: number, quality: string, material_type: string): Promise<string> {
    const material_id = `material-${material_type}-${Date.now()}`;
    
    this.globalInventory.set(material_id, {
      material_id,
      stock_kg,
      quality,
      material_type,
      registered_at: Date.now(),
      available: true,
      provenance: 'verified_recovery' // All materials from recovery/recycling
    });

    await this.emit_event('MATERIAL_REGISTERED', 
      `Material registered: ${stock_kg}kg ${material_type} (${quality} grade)`,
      { material_id, stock_kg, quality, material_type }
    );

    return material_id;
  }

  async propose_material_allocation(params: {
    from_rescue_hub: string,
    to_project: string,
    kg: number,
    duration: number, // hours
    material_type: string
  }): Promise<string> {
    const proposal_id = `material-alloc-${Date.now()}`;
    
    // Verify material availability first
    const available = await this.verify_material_availability(params.material_type, params.kg);
    if (!available) {
      throw new Error(`Insufficient ${params.material_type} stock available`);
    }
    
    const proposal: Proposal = {
      id: proposal_id,
      domain: this.domain,
      author: 'system',
      changes: [{ 
        type: 'material_allocation', 
        ...params,
        prioritizes_recovered: true // Always prioritize recovered materials
      }],
      metrics_claim: {
        eco: 2.8, // High ecological benefit from reuse
        well: 1.2,
        eff: 2.0,
        res: 3.2, // Very high resilience through circular economy
        equ: 1.8,
        inn: 2.5
      },
      rationale_hash: `material-${params.material_type}-${params.kg}`,
      status: 'pending',
      quorum_req: 2,
      created_at: Date.now(),
      expires_at: Date.now() + (3 * 24 * 60 * 60 * 1000)
    };

    this.proposals.set(proposal_id, proposal);
    
    await this.emit_event('RESOURCE_PROPOSAL', 
      `Material allocation: ${params.kg}kg ${params.material_type} ${params.from_rescue_hub}→${params.to_project} (${params.duration}h)`,
      { proposal_id, ...params }
    );

    return proposal_id;
  }

  async attest_availability(material_type: string, kg_requested: number): Promise<void> {
    const available = await this.verify_material_availability(material_type, kg_requested);
    const current_stock = this.calculate_total_stock(material_type);
    
    await this.emit_event('AVAILABILITY_ATTESTED', 
      `${material_type} availability: ${current_stock}kg stock, ${kg_requested}kg requested - ${available ? 'AVAILABLE' : 'INSUFFICIENT'}`,
      { material_type, current_stock, kg_requested, available }
    );
  }

  async enact_material_flow(proposal_id: string): Promise<void> {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal || proposal.status !== 'pending') {
      throw new Error('Invalid proposal for enactment');
    }

    const allocationChange = proposal.changes.find(c => c.type === 'material_allocation');
    if (!allocationChange) throw new Error('No material allocation specification');

    // Verify availability again before enactment
    const available = await this.verify_material_availability(
      allocationChange.material_type, 
      allocationChange.kg
    );
    if (!available) {
      throw new Error('Materials no longer available');
    }

    // Check no artificial scarcity (key guardrail)
    const artificial_scarcity = await this.detect_artificial_scarcity(allocationChange.material_type);
    if (artificial_scarcity) {
      throw new Error('Artificial scarcity detected - allocation blocked');
    }

    // Open material faucet
    const faucet_id = await this.open_faucet(
      allocationChange.from_rescue_hub,
      allocationChange.to_project,
      allocationChange.material_type,
      allocationChange.kg / allocationChange.duration, // rate per hour
      allocationChange.duration
    );

    // Reserve materials in inventory
    await this.reserve_materials(allocationChange.material_type, allocationChange.kg);

    proposal.status = 'enacted';

    await this.emit_event('EVT_MATERIAL_FLOW_OPENED', 
      `Material flow: ${allocationChange.kg}kg ${allocationChange.material_type} ${allocationChange.from_rescue_hub}→${allocationChange.to_project}`,
      { proposal_id, faucet_id }
    );
  }

  async record_recycling(recovered_kg: number, material_type: string, source: string): Promise<void> {
    const record_id = `recycling-${Date.now()}`;
    
    const record = {
      record_id,
      recovered_kg,
      material_type,
      source,
      timestamp: Date.now(),
      quality_grade: this.calculate_recovery_quality(material_type),
      circular_value: recovered_kg * this.get_circular_multiplier(material_type)
    };

    this.recyclingRecords.set(record_id, record);

    // Add recovered material to inventory
    const material_id = await this.register_material(
      recovered_kg, 
      record.quality_grade, 
      `recovered_${material_type}`
    );

    await this.emit_event('EVT_RECOVERY_RECORDED', 
      `Recovery: ${recovered_kg}kg ${material_type} from ${source} (${record.quality_grade} grade)`,
      { record_id, material_id, recovered_kg, material_type, source }
    );
  }

  private async verify_material_availability(material_type: string, kg_needed: number): Promise<boolean> {
    const total_stock = this.calculate_total_stock(material_type);
    return total_stock >= kg_needed;
  }

  private calculate_total_stock(material_type: string): number {
    let total = 0;
    for (const [_, material] of this.globalInventory) {
      if (material.material_type === material_type || 
          material.material_type === `recovered_${material_type}`) {
        total += material.stock_kg;
      }
    }
    return total;
  }

  private async detect_artificial_scarcity(material_type: string): Promise<boolean> {
    // Check if there's actual scarcity vs artificial withholding
    const total_stock = this.calculate_total_stock(material_type);
    const recent_demand = 500; // Mock calculation of recent demand
    
    // If we have 10x demand in stock but claiming scarcity, flag it
    const artificial = total_stock > (recent_demand * 10) && total_stock < 1000;
    
    if (artificial) {
      await this.emit_event('ARTIFICIAL_SCARCITY_DETECTED', 
        `Artificial scarcity flagged for ${material_type}: ${total_stock}kg stock vs ${recent_demand}kg demand`,
        { material_type, total_stock, recent_demand }
      );
    }
    
    return artificial;
  }

  private async reserve_materials(material_type: string, kg_needed: number): Promise<void> {
    let remaining = kg_needed;
    
    for (const [material_id, material] of this.globalInventory) {
      if ((material.material_type === material_type || 
           material.material_type === `recovered_${material_type}`) && 
          remaining > 0 && material.available) {
        
        const to_reserve = Math.min(remaining, material.stock_kg);
        material.stock_kg -= to_reserve;
        remaining -= to_reserve;
        
        if (material.stock_kg === 0) {
          material.available = false;
        }
      }
    }
  }

  private calculate_recovery_quality(material_type: string): string {
    // Mock quality assessment based on material type
    const quality_map: Record<string, string> = {
      'aluminum': 'A+',
      'steel': 'A',
      'plastic': 'B+',
      'composite': 'A'
    };
    return quality_map[material_type] || 'B';
  }

  private get_circular_multiplier(material_type: string): number {
    // Value multiplier for circular economy impact
    const multipliers: Record<string, number> = {
      'aluminum': 3.5, // Very high circularity value
      'steel': 2.8,
      'rare_earth': 5.0,
      'plastic': 1.5
    };
    return multipliers[material_type] || 2.0;
  }

  // Base contract implementations
  async create_proposal(author: string, changes: any[], metrics_claim: Proposal['metrics_claim'], rationale_hash: string): Promise<string> {
    const proposal_id = `iota-${Date.now()}`;
    
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
    await this.emit_event('PROPOSAL_CREATED', `Resource proposal ${proposal_id}`, { proposal_id });
    return proposal_id;
  }

  async attest_proposal(proposal_id: string, vote: 'approve' | 'reject' | 'abstain', note_hash: string): Promise<void> {
    await this.emit_event('PROPOSAL_ATTESTED', 
      `Resource proposal ${proposal_id} attested: ${vote}`,
      { proposal_id, vote }
    );
  }

  async enact_proposal(proposal_id: string): Promise<void> {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal) throw new Error('Proposal not found');
    proposal.status = 'enacted';
    await this.emit_event('PROPOSAL_ENACTED', `Resource proposal ${proposal_id} enacted`);
  }

  async rollback_proposal(proposal_id: string): Promise<void> {
    const proposal = this.proposals.get(proposal_id);
    if (!proposal) throw new Error('Proposal not found');
    proposal.status = 'rejected';
    await this.emit_event('PROPOSAL_ROLLBACK', `Resource proposal ${proposal_id} rolled back`);
  }

  async open_faucet(from_node: string, to_node: string, rtype: string, max_rate: number, duration: number): Promise<string> {
    const faucet_id = `iota-faucet-${Date.now()}`;
    
    const faucet = {
      faucet_id,
      from_node,
      to_node,
      rtype,
      max_rate,
      current_rate: max_rate,
      opens_at: Date.now(),
      closes_at: Date.now() + (duration * 60 * 60 * 1000),
      status: 'active',
      material_flow: true
    };

    this.materialFaucets.set(faucet_id, faucet);

    await this.emit_event('EVT_MATERIAL_FLOW_OPENED', 
      `Material faucet: ${max_rate} ${rtype}/h ${from_node}→${to_node} (${duration}h)`,
      { faucet_id, from_node, to_node, rtype, max_rate, duration }
    );
    
    return faucet_id;
  }

  async scale_faucet(faucet_id: string, new_rate: number): Promise<void> {
    const faucet = this.materialFaucets.get(faucet_id);
    if (faucet) {
      faucet.current_rate = new_rate;
      await this.emit_event('MATERIAL_FAUCET_SCALED', 
        `Material faucet ${faucet_id} scaled to ${new_rate}`,
        { faucet_id, new_rate }
      );
    }
  }

  async close_faucet(faucet_id: string): Promise<void> {
    const faucet = this.materialFaucets.get(faucet_id);
    if (faucet) {
      faucet.status = 'closed';
      await this.emit_event('MATERIAL_FAUCET_CLOSED', 
        `Material faucet ${faucet_id} closed`,
        { faucet_id }
      );
    }
  }

  async stake_vpc(wallet: string, amount: number, lock_days: number): Promise<void> {
    await this.emit_event('RESOURCE_STAKING', 
      `+${amount} VPC staked in Resources | Pool: ${(10800 + amount).toLocaleString()} VPC | Resilience: +${(amount * 0.0028).toFixed(1)}`,
      { wallet, amount, lock_days }
    );
  }

  async unstake_vpc(wallet: string, amount: number): Promise<void> {
    await this.emit_event('VPC_UNSTAKED', 
      `-${amount} VPC unstaked from Resources`,
      { wallet, amount }
    );
  }

  async issue_ticket(wallet: string, amount: number): Promise<void> {
    await this.emit_event('TICKET_ISSUED', 
      `Resource access ticket: ${amount} to ${wallet}`,
      { wallet, amount }
    );
  }

  async consume_ticket(wallet: string, amount: number): Promise<void> {
    await this.emit_event('TICKET_CONSUMED', 
      `Resource ticket consumed: ${amount} by ${wallet}`,
      { wallet, amount }
    );
  }

  async record_telemetry(metrics: Record<string, number>, sensor_data: Record<string, any>): Promise<void> {
    await this.emit_event('RESOURCE_TELEMETRY', 
      `Resource metrics: ${(metrics.circularity_rate || 0.81 * 100).toFixed(0)}% circularity, ${metrics.waste_diversion || 0.89 * 100}% waste diverted`,
      { metrics, sensor_data }
    );
  }

  async assert_thresholds(): Promise<boolean> {
    // Check for artificial scarcity across all materials
    let violations = 0;
    const material_types = ['aluminum', 'steel', 'plastic', 'composite'];
    
    for (const material of material_types) {
      const artificial = await this.detect_artificial_scarcity(material);
      if (artificial) violations++;
    }
    
    return violations === 0;
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
    console.log(`[IOTA CONTRACT] ${message}`, data);
  }

  getProposals(): Proposal[] {
    return Array.from(this.proposals.values());
  }

  getEvents(): ContractEvent[] {
    return this.events;
  }

  getInventory(): any[] {
    return Array.from(this.globalInventory.values());
  }

  getRecyclingRecords(): any[] {
    return Array.from(this.recyclingRecords.values());
  }
}