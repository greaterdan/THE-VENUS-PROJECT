import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Brain, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimulationEvent {
  id: string;
  timestamp: Date;
  type: 'decision' | 'resource' | 'communication' | 'system';
  agentFrom: string;
  agentTo?: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'processing' | 'completed' | 'pending';
}

export function LiveSimulationFeed() {
  const [events, setEvents] = useState<SimulationEvent[]>([]);

  // Mock real-time events
  useEffect(() => {
    const mockEvents: Omit<SimulationEvent, 'id' | 'timestamp'>[] = [
      {
        type: 'decision',
        agentFrom: 'Alpha',
        agentTo: 'Beta',
        message: 'Energy grid optimization complete - 12% efficiency gain achieved',
        priority: 'high',
        status: 'completed'
      },
      {
        type: 'resource',
        agentFrom: 'Gamma',
        message: 'Hydroponic yield increased to 847 kg/day following nutrient adjustment',
        priority: 'medium',
        status: 'completed'
      },
      {
        type: 'communication',
        agentFrom: 'Delta',
        agentTo: 'Epsilon',
        message: 'Biodiversity index stable at 94.2% - social wellbeing correlation confirmed',
        priority: 'medium',
        status: 'processing'
      },
      {
        type: 'system',
        agentFrom: 'Zeta',
        message: 'Transport efficiency optimization: Route algorithm updated - 8% faster',
        priority: 'low',
        status: 'completed'
      },
      {
        type: 'decision',
        agentFrom: 'Eta',
        agentTo: 'Theta',
        message: 'Health metrics analysis complete - preventive care protocol active',
        priority: 'high',
        status: 'completed'
      },
      {
        type: 'resource',
        agentFrom: 'Iota',
        message: 'Resource allocation optimized: 15% waste reduction in sector 7',
        priority: 'medium',
        status: 'processing'
      },
      {
        type: 'communication',
        agentFrom: 'Kappa',
        agentTo: 'Alpha',
        message: 'Governance consensus reached on infrastructure expansion proposal',
        priority: 'high',
        status: 'pending'
      }
    ];

    const addRandomEvent = () => {
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      const newEvent: SimulationEvent = {
        ...randomEvent,
        id: Date.now().toString(),
        timestamp: new Date()
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep latest 20 events
    };

    // Add initial events
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addRandomEvent(), i * 500);
    }

    // Add new events periodically
    const interval = setInterval(addRandomEvent, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'decision': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'resource': return <Zap className="w-4 h-4 text-slate-500" />;
      case 'communication': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'system': return <AlertCircle className="w-4 h-4 text-orange-400" />;
      default: return <Activity className="w-4 h-4 text-white/60" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-400/20 text-red-400';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400';
      case 'low': return 'bg-gray-400/20 text-gray-400';
      default: return 'bg-white/20 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-400/20 text-green-400';
      case 'processing': return 'bg-blue-400/20 text-blue-400';
      case 'pending': return 'bg-yellow-400/20 text-yellow-400';
      default: return 'bg-white/20 text-white';
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-500" />
          Live AGORA Feed
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-white/60">Real-time</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[480px] px-6">
          <AnimatePresence>
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-4 bg-white/5 rounded-lg border-l-4 border-slate-500/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getPriorityColor(event.priority)}>
                        {event.priority}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                      <span className="text-xs text-white/50 font-mono">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <span className="font-medium text-slate-500">{event.agentFrom}</span>
                      {event.agentTo && (
                        <>
                          <span className="text-white/50">→</span>
                          <span className="font-medium text-blue-400">{event.agentTo}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-white/80 leading-relaxed">
                      {event.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        {/* Stats footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-mono text-purple-400">
                {events.filter(e => e.type === 'decision').length}
              </div>
              <div className="text-xs text-white/60">Decisions</div>
            </div>
            <div>
              <div className="text-lg font-mono text-slate-500">
                {events.filter(e => e.type === 'resource').length}
              </div>
              <div className="text-xs text-white/60">Resources</div>
            </div>
            <div>
              <div className="text-lg font-mono text-blue-400">
                {events.filter(e => e.type === 'communication').length}
              </div>
              <div className="text-xs text-white/60">Messages</div>
            </div>
            <div>
              <div className="text-lg font-mono text-orange-400">
                {events.filter(e => e.status === 'processing').length}
              </div>
              <div className="text-xs text-white/60">Processing</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}