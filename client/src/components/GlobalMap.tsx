import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NodeLocation {
  id: string;
  lat: number;
  lng: number;
  country: string;
  nodeCount: number;
  tflops: number;
}

export function GlobalMap() {
  const [activeNodes, setActiveNodes] = useState<NodeLocation[]>([]);
  const [pulsingNodes, setPulsingNodes] = useState<Set<string>>(new Set());

  // Mock global node data
  useEffect(() => {
    const mockNodes: NodeLocation[] = [
      { id: '1', lat: 40.7128, lng: -74.0060, country: 'USA (NYC)', nodeCount: 347, tflops: 23.4 },
      { id: '2', lat: 37.7749, lng: -122.4194, country: 'USA (SF)', nodeCount: 289, tflops: 19.8 },
      { id: '3', lat: 51.5074, lng: -0.1278, country: 'UK', nodeCount: 156, tflops: 12.7 },
      { id: '4', lat: 48.8566, lng: 2.3522, country: 'France', nodeCount: 134, tflops: 11.2 },
      { id: '5', lat: 35.6762, lng: 139.6503, country: 'Japan', nodeCount: 245, tflops: 18.9 },
      { id: '6', lat: -33.8688, lng: 151.2093, country: 'Australia', nodeCount: 89, tflops: 7.3 },
      { id: '7', lat: 52.5200, lng: 13.4050, country: 'Germany', nodeCount: 178, tflops: 14.6 },
      { id: '8', lat: 55.7558, lng: 37.6173, country: 'Russia', nodeCount: 123, tflops: 9.8 },
    ];
    
    setActiveNodes(mockNodes);

    // Simulate node activity pulses
    const interval = setInterval(() => {
      const randomNode = mockNodes[Math.floor(Math.random() * mockNodes.length)];
      setPulsingNodes(prev => new Set(prev).add(randomNode.id));
      
      setTimeout(() => {
        setPulsingNodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomNode.id);
          return newSet;
        });
      }, 2000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert lat/lng to SVG coordinates (simplified world map)
  const toSVG = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  return (
    <Card className="bg-white border text-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-slate-600" />
          Global Node Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 bg-slate-900/20 rounded-lg overflow-hidden">
          {/* World map background (simplified) */}
          <svg viewBox="0 0 800 400" className="w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="800" height="400" fill="url(#grid)" />
          </svg>

          {/* Node markers */}
          <div className="absolute inset-0">
            {activeNodes.map((node) => {
              const { x, y } = toSVG(node.lat, node.lng);
              const isPulsing = pulsingNodes.has(node.id);
              
              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${(x / 800) * 100}%`, top: `${(y / 400) * 100}%` }}
                >
                  {/* Pulse animation */}
                  <AnimatePresence>
                    {isPulsing && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 3, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 w-3 h-3 bg-slate-500 rounded-full"
                      />
                    )}
                  </AnimatePresence>

                  {/* Node dot */}
                  <motion.div
                    className={`w-3 h-3 rounded-full border-2 border-white/30 ${
                      isPulsing ? 'bg-slate-500 scale-125' : 'bg-blue-400'
                    } transition-all duration-300`}
                    animate={{ scale: isPulsing ? 1.2 : 1 }}
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/90 backdrop-blur-xl rounded-lg p-2 text-xs whitespace-nowrap border border-white/10">
                      <div className="font-medium">{node.country}</div>
                      <div className="text-white/60">{node.nodeCount} nodes</div>
                      <div className="text-slate-500">{node.tflops}T FLOPS</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity indicator */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs text-white/60">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            Live Activity
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <div className="text-lg font-mono text-blue-400">
              {activeNodes.length}
            </div>
            <div className="text-xs text-white/60">Regions</div>
          </div>
          <div>
            <div className="text-lg font-mono text-slate-500">
              {activeNodes.reduce((sum, node) => sum + node.nodeCount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-white/60">Total Nodes</div>
          </div>
          <div>
            <div className="text-lg font-mono text-purple-400">
              {activeNodes.reduce((sum, node) => sum + node.tflops, 0).toFixed(1)}T
            </div>
            <div className="text-xs text-white/60">Combined FLOPS</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}