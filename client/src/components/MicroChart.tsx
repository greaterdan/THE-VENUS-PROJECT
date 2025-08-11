import { motion } from 'framer-motion';

interface MicroChartProps {
  type: 'efficiency' | 'wellbeing' | 'biodiversity' | 'resources';
  value: number;
  change: number;
  className?: string;
}

export default function MicroChart({ type, value, change, className = '' }: MicroChartProps) {
  const isPositive = change > 0;
  
  const chartColors = {
    efficiency: 'bg-blue-400',
    wellbeing: 'bg-green-400',
    biodiversity: 'bg-emerald-400',
    resources: 'bg-orange-400'
  };

  const generateSparkline = () => {
    const points = [];
    const baseValue = value - Math.abs(change);
    for (let i = 0; i < 8; i++) {
      const variation = (Math.sin(i * 0.5) * change * 0.3);
      points.push(Math.max(0, Math.min(100, baseValue + variation + (change * i / 7))));
    }
    return points;
  };

  const sparklineData = generateSparkline();
  const maxValue = Math.max(...sparklineData);

  return (
    <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 ${className}`}>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-700 capitalize">{type}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-800">{value}%</span>
          <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Mini sparkline */}
      <div className="flex items-end gap-0.5 h-6 w-12">
        {sparklineData.map((point, index) => (
          <motion.div
            key={index}
            className={`${chartColors[type]} opacity-60 w-1 rounded-sm`}
            style={{ height: `${(point / maxValue) * 100}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${(point / maxValue) * 100}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}