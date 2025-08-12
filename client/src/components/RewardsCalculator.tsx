import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, Coins, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function RewardsCalculator() {
  const [hours, setHours] = useState(8);
  const [gpuPower, setGpuPower] = useState(50);

  // Base rate: 0.1 VNS per hour at 50% GPU power
  const baseRate = 0.1;
  const powerMultiplier = gpuPower / 50;
  const hourlyRate = baseRate * powerMultiplier;
  const weeklyEarnings = hourlyRate * hours * 7;

  const getGpuTier = (power: number) => {
    if (power >= 80) return { tier: 'High Performance', color: 'text-red-400', bg: 'bg-red-400/20' };
    if (power >= 50) return { tier: 'Balanced', color: 'text-slate-500', bg: 'bg-slate-500/20' };
    return { tier: 'Power Saving', color: 'text-blue-400', bg: 'bg-blue-400/20' };
  };

  const gpuTier = getGpuTier(gpuPower);

  return (
    <Card className="bg-white border text-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-slate-600" />
          Rewards Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hours per day slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hours per day
            </label>
            <span className="text-slate-600 font-mono">{hours}h</span>
          </div>
          <Slider
            value={[hours]}
            onValueChange={(value) => setHours(value[0])}
            max={24}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* GPU power slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              GPU Power
            </label>
            <div className="flex items-center gap-2">
              <Badge className={`${gpuTier.bg} ${gpuTier.color}`}>
                {gpuTier.tier}
              </Badge>
              <span className="text-slate-500 font-mono">{gpuPower}%</span>
            </div>
          </div>
          <Slider
            value={[gpuPower]}
            onValueChange={(value) => setGpuPower(value[0])}
            max={100}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        {/* Earnings projection */}
        <motion.div
          key={`${hours}-${gpuPower}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-gradient-to-r from-slate-600/10 to-slate-600/10 rounded-lg border border-slate-600/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-5 h-5 text-slate-500" />
            <h3 className="font-medium">Estimated Earnings</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-mono text-slate-500">
                {hourlyRate.toFixed(3)}
              </div>
              <div className="text-sm text-white/60">VNS per hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-slate-500">
                {weeklyEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-white/60">VNS per week</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Monthly projection:</span>
              <span className="font-mono text-slate-500">
                {(weeklyEarnings * 4.33).toFixed(2)} VNS
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-white/60">At current rate ($0.25/VNS):</span>
              <span className="font-mono text-green-400">
                ${(weeklyEarnings * 4.33 * 0.25).toFixed(2)} USD
              </span>
            </div>
          </div>
        </motion.div>

        {/* Performance notes */}
        <div className="text-xs text-white/50 space-y-1">
          <p>• Rates may vary based on network demand and GPU efficiency</p>
          <p>• Desktop nodes earn 2-5x more VNS than browser-based contribution</p>
          <p>• Additional bonuses for consistency and uptime achievements</p>
        </div>
      </CardContent>
    </Card>
  );
}