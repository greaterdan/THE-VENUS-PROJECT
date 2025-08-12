// Smart Contract Types and Interfaces for The Venus Project
// Based on the 10-Agent specification

import { z } from 'zod';

// Shared Primitives
export const ResourceTypeSchema = z.object({
  symbol: z.string(),
  unit: z.string(),
  env_factor: z.number(),
});

export const CityNodeSchema = z.object({
  node_id: z.string(),
  kind: z.string(),
  capacities: z.record(z.string(), z.number()), // ResourceType symbol -> capacity
});

export const FaucetSchema = z.object({
  from_node: z.string(),
  to_node: z.string(),
  rtype: z.string(),
  max_rate: z.number(),
  current_rate: z.number(),
  opens_at: z.number(),
  closes_at: z.number(),
  policy_ref: z.string(),
  status: z.enum(['active', 'pending', 'closed', 'paused']),
});

export const ProposalSchema = z.object({
  id: z.string(),
  domain: z.enum(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']),
  author: z.string(),
  changes: z.array(z.record(z.string(), z.any())),
  metrics_claim: z.object({
    eco: z.number(),
    well: z.number(),
    eff: z.number(),
    res: z.number(),
    equ: z.number(),
    inn: z.number(),
  }),
  rationale_hash: z.string(),
  status: z.enum(['pending', 'reviewing', 'enacted', 'rejected', 'expired']),
  quorum_req: z.number(),
  created_at: z.number(),
  expires_at: z.number(),
});

export const AttestationSchema = z.object({
  proposal_id: z.string(),
  signer_domain: z.enum(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']),
  vote: z.enum(['approve', 'reject', 'abstain']),
  note_hash: z.string(),
  ts: z.number(),
});

export const StakePoolSchema = z.object({
  domain: z.enum(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']),
  vpc_total: z.number(),
  faucet_threshold: z.number(),
  influence_weight: z.number(),
  active_stakers: z.number(),
});

export const StakePositionSchema = z.object({
  domain: z.enum(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']),
  wallet: z.string(),
  amount: z.number(),
  lock_until: z.number(),
});

export const AccessTicketSchema = z.object({
  wallet: z.string(),
  domain: z.enum(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']),
  amount: z.number(),
  unlock_ts: z.number(),
});

export const ReputationSchema = z.object({
  wallet: z.string(),
  ecology: z.number(),
  equity: z.number(),
  efficiency: z.number(),
  resilience: z.number(),
  innovation: z.number(),
  reliability: z.number(),
});

export const TelemetryFeedSchema = z.object({
  domain: z.enum(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']),
  timestamp: z.number(),
  metrics: z.record(z.string(), z.number()),
  sensor_data: z.record(z.string(), z.any()),
});

// Contract Event Types
export const ContractEventSchema = z.object({
  timestamp: z.number(),
  domain: z.enum(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']),
  event_type: z.string(),
  message: z.string(),
  data: z.record(z.string(), z.any()).optional(),
});

// Type exports
export type ResourceType = z.infer<typeof ResourceTypeSchema>;
export type CityNode = z.infer<typeof CityNodeSchema>;
export type Faucet = z.infer<typeof FaucetSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
export type Attestation = z.infer<typeof AttestationSchema>;
export type StakePool = z.infer<typeof StakePoolSchema>;
export type StakePosition = z.infer<typeof StakePositionSchema>;
export type AccessTicket = z.infer<typeof AccessTicketSchema>;
export type Reputation = z.infer<typeof ReputationSchema>;
export type TelemetryFeed = z.infer<typeof TelemetryFeedSchema>;
export type ContractEvent = z.infer<typeof ContractEventSchema>;

// Agent Domain Mapping
export const AGENT_DOMAINS = {
  alpha: 'Infrastructure & Habitat',
  beta: 'Energy Systems',
  gamma: 'Food & Agriculture',
  delta: 'Ecology & Environmental Restoration',
  epsilon: 'Social & Wellbeing',
  zeta: 'Transportation & Mobility',
  eta: 'Health & Medical',
  theta: 'Education & Knowledge',
  iota: 'Resource Management & Allocation',
  kappa: 'Culture, Ethics & Governance',
} as const;

// Common Contract Instructions Interface
export interface BaseAgentContract {
  // Proposal Management
  create_proposal(author: string, changes: any[], metrics_claim: Proposal['metrics_claim'], rationale_hash: string): Promise<string>;
  attest_proposal(proposal_id: string, vote: 'approve' | 'reject' | 'abstain', note_hash: string): Promise<void>;
  enact_proposal(proposal_id: string): Promise<void>;
  rollback_proposal(proposal_id: string): Promise<void>;

  // Faucet Management
  open_faucet(from_node: string, to_node: string, rtype: string, max_rate: number, duration: number): Promise<string>;
  scale_faucet(faucet_id: string, new_rate: number): Promise<void>;
  close_faucet(faucet_id: string): Promise<void>;

  // Staking Operations
  stake_vpc(wallet: string, amount: number, lock_days: number): Promise<void>;
  unstake_vpc(wallet: string, amount: number): Promise<void>;
  issue_ticket(wallet: string, amount: number): Promise<void>;
  consume_ticket(wallet: string, amount: number): Promise<void>;

  // Telemetry & Monitoring
  record_telemetry(metrics: Record<string, number>, sensor_data: Record<string, any>): Promise<void>;
  assert_thresholds(): Promise<boolean>;

  // Events
  emit_event(event_type: string, message: string, data?: Record<string, any>): Promise<void>;
}