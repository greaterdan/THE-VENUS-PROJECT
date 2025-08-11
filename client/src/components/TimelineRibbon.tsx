import { motion } from 'framer-motion';

interface TimelineMarker {
  id: string;
  agentName: string;
  timestamp: Date;
  type: 'update' | 'decision' | 'alert';
}

interface TimelineRibbonProps {
  markers: TimelineMarker[];
  onMarkerClick: (markerId: string) => void;
  className?: string;
}

export default function TimelineRibbon({ markers, onMarkerClick, className = '' }: TimelineRibbonProps) {
  const typeColors = {
    update: 'bg-blue-500',
    decision: 'bg-lime-500',
    alert: 'bg-red-500'
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`fixed right-4 top-20 bottom-20 w-8 flex flex-col ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-lime-300 to-transparent"></div>
      
      {/* Scrollable markers container */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {markers.map((marker, index) => (
          <motion.div
            key={marker.id}
            className="relative mb-4 cursor-pointer group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onMarkerClick(marker.id)}
          >
            {/* Marker dot */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${typeColors[marker.type]} shadow-lg group-hover:scale-125 transition-transform`}></div>
            
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-xl text-xs whitespace-nowrap border border-lime-500/20">
                <div className="font-semibold text-black">{marker.agentName}</div>
                <div className="text-gray-600">{formatTime(marker.timestamp)}</div>
                <div className="text-gray-600 capitalize">{marker.type}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}