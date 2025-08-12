import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { WalletConnect } from '@/components/WalletConnect';
import { GPUController } from '@/components/GPUController';
import { NetworkStats } from '@/components/NetworkStats';
import { RewardsCalculator } from '@/components/RewardsCalculator';

import { Leaderboard } from '@/components/Leaderboard';
import { ContributorStatus } from '@/components/ContributorStatus';

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
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-6 py-12" style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-8 leading-relaxed">
              Contribute your GPU power to help The Venus Project's City grow and make decisions faster, while earning voting rights to shape its future and gaining early access to upcoming features.
            </h1>
            <div className="flex justify-center">
              <WalletConnect
                onConnect={handleWalletConnect}
                isConnected={isConnected}
                walletAddress={walletAddress}
                vnsBalance={vnsBalance}
              />
            </div>
          </div>
        </div>

        {/* Real-Time Network Stats */}
        <div className="mb-20">
          <NetworkStats />
        </div>

        {/* Educational Hook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 p-8 bg-gradient-to-r from-gray-50 to-lime-50 rounded-2xl border border-gray-100"
        >
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-lime-100">
              <Brain className="w-8 h-8 text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-medium mb-4 text-gray-800">Every Second Counts</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Every second your GPU runs, the Venus AI city learns faster — balancing energy, 
                resources, and wellbeing in real time. Your contribution directly accelerates 
                the development of sustainable urban solutions.
              </p>
              <div className="flex items-start gap-3 p-4 bg-white/70 rounded-xl border border-white/50">
                <Info className="w-5 h-5 text-gray-500 mt-0.5" />
                <span className="text-gray-600 leading-relaxed">
                  Currently processing: Urban optimization algorithms, resource distribution models, 
                  and social harmony calculations
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Controls */}
          <div className="lg:col-span-2 space-y-12">
            {/* GPU Controller */}
            <GPUController
              isRunning={isGPURunning}
              onToggle={handleGPUToggle}
              gpuPower={gpuPower}
              onPowerChange={setGPUPower}
              stats={gpuStats}
            />



            {/* Rewards Calculator */}
            <RewardsCalculator />

            {/* Leaderboard */}
            <Leaderboard />
          </div>

          {/* Right Column - Status */}
          <div className="space-y-12">
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
          </div>
        </div>

        {/* Terminal-style Activity Log */}
        {isGPURunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 p-8 bg-gray-900 rounded-2xl border border-gray-800"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></div>
              <span className="text-slate-500 font-mono text-sm">GPU NODE ACTIVITY</span>
            </div>
            <div className="font-mono text-xs space-y-1 text-gray-300">
              <div>[12:04:32] GPU initialized - NVIDIA RTX 4080 detected</div>
              <div>[12:04:33] WebGPU context established - {gpuPower}% power allocated</div>
              <div>[12:04:34] Connected to Venus AI network - Node ID: VN_7xQ8K2B9</div>
              <div>[12:04:35] <span className="text-slate-500">Processing batch</span> - Energy grid optimization (Alpha → Beta)</div>
              <div>[12:04:36] <span className="text-gray-400">Computation complete</span> - 2.4M FLOPS contributed</div>
              <div>[12:04:37] <span className="text-slate-500">Reward earned</span> - +0.0023 VNS</div>
              <div>[12:04:38] <span className="text-slate-500">Processing batch</span> - Resource allocation model (Iota)</div>
            </div>
          </motion.div>
        )}

        {/* Getting Started CTA for non-connected users */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 text-center p-12 bg-gradient-to-br from-gray-50 to-lime-50 rounded-2xl border border-gray-100"
          >
            <h3 className="text-3xl font-medium mb-6 text-gray-800">Ready to Power the Future?</h3>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Connect your wallet to start contributing GPU power to the Venus AI city simulation. 
              Earn VNS tokens while helping build sustainable urban solutions.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge className="bg-gray-100 text-gray-600 hover:bg-lime-100 hover:text-slate-700 transition-colors">
                ⚡ Browser-based - No download required
              </Badge>
              <Badge className="bg-gray-100 text-gray-600 hover:bg-lime-100 hover:text-slate-700 transition-colors">
                🔒 Secure WebGPU technology
              </Badge>
              <Badge className="bg-gray-100 text-gray-600 hover:bg-lime-100 hover:text-slate-700 transition-colors">
                💰 Instant VNS rewards
              </Badge>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}