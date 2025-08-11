import { motion } from 'framer-motion';
import { Zap, Droplets, Wrench, Clock } from 'lucide-react';

interface ResourceFlowProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  resourceType: 'energy' | 'water' | 'materials' | 'time';
  amount: number;
}

export default function ResourceFlow({ from, to, resourceType, amount }: ResourceFlowProps) {
  const icons = {
    energy: Zap,
    water: Droplets,
    materials: Wrench,
    time: Clock
  };

  const colors = {
    energy: 'text-yellow-400',
    water: 'text-blue-400',
    materials: 'text-gray-400',
    time: 'text-purple-400'
  };

  const Icon = icons[resourceType];
  
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));

  return (
    <div className="absolute pointer-events-none">
      {/* Connection line */}
      <motion.div
        className="absolute bg-gradient-to-r from-transparent via-white/30 to-transparent h-0.5"
        style={{
          left: from.x,
          top: from.y,
          width: distance,
          transformOrigin: '0 50%',
          transform: `rotate(${angle}rad)`
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      
      {/* Moving resource icon */}
      <motion.div
        className={`absolute ${colors[resourceType]} opacity-80`}
        style={{
          left: from.x - 8,
          top: from.y - 8
        }}
        animate={{
          left: to.x - 8,
          top: to.y - 8
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <Icon className="w-4 h-4" />
      </motion.div>
    </div>
  );
}