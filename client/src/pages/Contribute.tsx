import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { WalletConnect } from '@/components/WalletConnect';
import { GPUController } from '@/components/GPUController';
import { NetworkStats } from '@/components/NetworkStats';
import { RewardsCalculator } from '@/components/RewardsCalculator';
import { GlobalMap } from '@/components/GlobalMap';
import { Leaderboard } from '@/components/Leaderboard';
import { ContributorStatus } from '@/components/ContributorStatus';
import { LiveSimulationFeed } from '@/components/LiveSimulationFeed';

export default function Contribute() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [vnsBalance] = useState(47.32);
  const [isGPURunning, setIsGPURunning] = useState(false);
  const [gpuPower, setGPUPower] = useState(50);

  const handleWalletConnect = (walletType: 'phantom' | 'metamask', address: string) => {
    setIsConnected(true);
    setWalletAddress(address);
  };

  const handleGPUToggle = () => {
    setIsGPURunning(!isGPURunning);
  };

  const gpuStats = {
    flopsContributed: 2847392847,
    decisionCyclePowered: 12.7,
    hoursRunning: 3.2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-lime-400/5 via-transparent to-blue-500/5" />
      <div className="fixed inset-0 bg-black/40" />

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                Contribute GPU
              </h1>
              <p className="text-white/60 mt-2">
                Power the Venus AI City simulation with your computing resources
              </p>
            </div>
            <WalletConnect
              onConnect={handleWalletConnect}
              isConnected={isConnected}
              walletAddress={walletAddress}
              vnsBalance={vnsBalance}
            />
          </div>

          {/* Real-Time Network Stats */}
          <div className="mb-12">
            <NetworkStats />
          </div>

          {/* Educational Hook */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-400/20 rounded-full">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Every Second Counts</h3>
                <p className="text-white/80 mb-4">
                  Every second your GPU runs, the Venus AI city learns faster — balancing energy, 
                  resources, and wellbeing in real time. Your contribution directly accelerates 
                  the development of sustainable urban solutions.
                </p>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">
                    Currently processing: Urban optimization algorithms, resource distribution models, 
                    and social harmony calculations
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Controls */}
            <div className="lg:col-span-2 space-y-8">
              {/* GPU Controller */}
              <GPUController
                isRunning={isGPURunning}
                onToggle={handleGPUToggle}
                gpuPower={gpuPower}
                onPowerChange={setGPUPower}
                stats={gpuStats}
              />

              {/* Global Network Map */}
              <GlobalMap />

              {/* Rewards Calculator */}
              <RewardsCalculator />

              {/* Leaderboard */}
              <Leaderboard />
            </div>

            {/* Right Column - Status & Feed */}
            <div className="space-y-8">
              {/* Contributor Status */}
              {isConnected && (
                <ContributorStatus
                  rank="Builder"
                  badges={['100_hours', 'early_adopter']}
                  hoursContributed={89.4}
                  nextRankRequirement={150}
                  dailyGoal={4}
                  todaysProgress={2.3}
                />
              )}

              {/* Live Simulation Feed */}
              <LiveSimulationFeed />
            </div>
          </div>

          {/* Terminal-style Activity Log */}
          {isGPURunning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-6 bg-black/50 backdrop-blur-xl rounded-xl border border-lime-400/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></div>
                <span className="text-lime-400 font-mono text-sm">GPU NODE ACTIVITY</span>
              </div>
              <div className="font-mono text-xs space-y-1 text-white/70">
                <div>[12:04:32] GPU initialized - NVIDIA RTX 4080 detected</div>
                <div>[12:04:33] WebGPU context established - {gpuPower}% power allocated</div>
                <div>[12:04:34] Connected to Venus AI network - Node ID: VN_7xQ8K2B9</div>
                <div>[12:04:35] <span className="text-lime-400">Processing batch</span> - Energy grid optimization (Alpha → Beta)</div>
                <div>[12:04:36] <span className="text-blue-400">Computation complete</span> - 2.4M FLOPS contributed</div>
                <div>[12:04:37] <span className="text-purple-400">Reward earned</span> - +0.0023 VNS</div>
                <div>[12:04:38] <span className="text-lime-400">Processing batch</span> - Resource allocation model (Iota)</div>
              </div>
            </motion.div>
          )}

          {/* Getting Started CTA for non-connected users */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center p-8 bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-xl border border-lime-500/20"
            >
              <h3 className="text-2xl font-bold mb-4">Ready to Power the Future?</h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Connect your wallet to start contributing GPU power to the Venus AI city simulation. 
                Earn VNS tokens while helping build sustainable urban solutions.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-lime-400/20 text-lime-400">
                  ⚡ Browser-based - No download required
                </Badge>
                <Badge className="bg-blue-400/20 text-blue-400">
                  🔒 Secure WebGPU technology
                </Badge>
                <Badge className="bg-purple-400/20 text-purple-400">
                  💰 Instant VNS rewards
                </Badge>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}