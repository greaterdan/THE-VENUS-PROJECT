import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Zap, Download, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GPUControllerProps {
  isRunning: boolean;
  onToggle: () => void;
  gpuPower: number;
  onPowerChange: (power: number) => void;
  stats: {
    flopsContributed: number;
    decisionCyclePowered: number;
    hoursRunning: number;
  };
}

export function GPUController({ isRunning, onToggle, gpuPower, onPowerChange, stats }: GPUControllerProps) {
  const [webGPUSupported, setWebGPUSupported] = useState(true);
  const [gpuInfo, setGPUInfo] = useState<string>('Detecting GPU...');

  useEffect(() => {
    // Simulate GPU detection
    const detectGPU = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGPUInfo('NVIDIA RTX 4080 (WebGPU)');
    };
    detectGPU();
  }, []);

  const formatFlops = (flops: number) => {
    if (flops >= 1e12) return `${(flops / 1e12).toFixed(1)}T`;
    if (flops >= 1e9) return `${(flops / 1e9).toFixed(1)}G`;
    if (flops >= 1e6) return `${(flops / 1e6).toFixed(1)}M`;
    return flops.toLocaleString();
  };

  return (
    <Card className="bg-white border text-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-lime-400" />
          Light Mode (WebGPU)
        </CardTitle>
        <CardDescription className="text-gray-600">
          Browser-based GPU contribution - no download required
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GPU Detection */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-lime-400" />
            <span className="text-sm">{gpuInfo}</span>
          </div>
          <Badge variant={webGPUSupported ? "default" : "destructive"} className="bg-lime-100 text-lime-700 border-lime-200">
            {webGPUSupported ? 'Compatible' : 'Not Supported'}
          </Badge>
        </div>

        {/* Power Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">GPU Power Allocation</label>
            <span className="text-lime-600 font-mono">{gpuPower}%</span>
          </div>
          <Slider
            value={[gpuPower]}
            onValueChange={(value) => onPowerChange(value[0])}
            max={100}
            min={10}
            step={5}
            className="w-full"
            disabled={isRunning}
          />
          <p className="text-xs text-gray-500">
            Higher allocation = more VNS rewards but may affect browser performance
          </p>
        </div>

        {/* Control Button */}
        <Button
          onClick={onToggle}
          size="lg"
          className={`w-full transition-all duration-300 ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-lime-400 hover:bg-lime-500 text-black'
          }`}
        >
          {isRunning ? (
            <>
              <Square className="w-5 h-5 mr-2" />
              Stop Contributing
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Contributing
            </>
          )}
        </Button>

        {/* Real-time Stats */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg"
            >
              <div className="text-center">
                <div className="text-lg font-mono text-lime-400">
                  {formatFlops(stats.flopsContributed)}
                </div>
                <div className="text-xs text-white/60">FLOPS Added</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono text-lime-400">
                  {stats.decisionCyclePowered.toFixed(1)}%
                </div>
                <div className="text-xs text-white/60">Cycle Powered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono text-lime-400">
                  {stats.hoursRunning.toFixed(1)}h
                </div>
                <div className="text-xs text-white/60">Runtime</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </CardContent>
    </Card>
  );
}