import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Zap, TrendingUp, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface NetworkStats {
  totalNodesOnline: number;
  totalTflops: number;
  simulationSpeedBoost: number;
  activeContributors: number;
}

export function NetworkStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/network-stats'],
    refetchInterval: 3000, // Update every 3 seconds
  });

  // Mock data for demonstration
  const mockStats: NetworkStats = {
    totalNodesOnline: 2847,
    totalTflops: 156.7,
    simulationSpeedBoost: 32.4,
    activeContributors: 1924
  };
  const networkStats = stats ? (stats as NetworkStats) : mockStats;

  const formatTflops = (tflops: number) => {
    if (tflops >= 1000) return `${(tflops / 1000).toFixed(1)}P`;
    return `${tflops.toFixed(1)}T`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-black">
              <Globe className="w-4 h-4 text-gray-500" />
              Nodes Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-black mb-1">
              {networkStats.totalNodesOnline?.toLocaleString() || '0'}
            </div>
            <Badge className="bg-lime-100 text-slate-700 text-xs">
              <Activity className="w-3 h-3 mr-1" />
              +127 this hour
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-black">
              <Zap className="w-4 h-4 text-slate-600" />
              Total GPU Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-slate-600 mb-1">
              {formatTflops(networkStats.totalTflops || 0)}FLOPS
            </div>
            <Badge className="bg-lime-100 text-slate-700 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.3T today
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-black">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              Speed Boost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-black mb-1">
              +{(networkStats.simulationSpeedBoost || 0).toFixed(1)}%
            </div>
            <Badge className="bg-gray-100 text-gray-600 text-xs">
              Decision cycles
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-black">
              <Users className="w-4 h-4 text-gray-500" />
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-black mb-1">
              {networkStats.activeContributors?.toLocaleString() || '0'}
            </div>
            <Badge className="bg-gray-100 text-gray-600 text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Active now
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}