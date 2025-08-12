import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Clock, Zap, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  username: string;
  walletAddress: string;
  rank: number;
  hoursContributed: number;
  totalVnsEarned: number;
  currentStreak: number;
  contributorRank: string;
  isOnline: boolean;
}

export function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('week');

  const { data: leaderboardData } = useQuery({
    queryKey: ['/api/leaderboard', timeFilter],
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Mock data for demonstration
  const mockData: LeaderboardEntry[] = [
    {
      id: '1',
      username: 'CryptoMiner2077',
      walletAddress: '7XvQ8K2B9Gh...uM3P',
      rank: 1,
      hoursContributed: 247.3,
      totalVnsEarned: 2847.92,
      currentStreak: 12,
      contributorRank: 'Visionary',
      isOnline: true
    },
    {
      id: '2',
      username: 'VenusBuilder',
      walletAddress: '0x742d...9C4f',
      rank: 2,
      hoursContributed: 189.7,
      totalVnsEarned: 2134.58,
      currentStreak: 8,
      contributorRank: 'Architect',
      isOnline: true
    },
    {
      id: '3',
      username: 'AIContributor',
      walletAddress: '9B8x...K3mN',
      rank: 3,
      hoursContributed: 156.2,
      totalVnsEarned: 1789.44,
      currentStreak: 5,
      contributorRank: 'Architect',
      isOnline: false
    },
    {
      id: '4',
      username: 'GPUPowerhouse',
      walletAddress: '3F2a...L8vR',
      rank: 4,
      hoursContributed: 134.8,
      totalVnsEarned: 1456.73,
      currentStreak: 15,
      contributorRank: 'Builder',
      isOnline: true
    },
    {
      id: '5',
      username: 'NodeRunner',
      walletAddress: '8H5j...P9wQ',
      rank: 5,
      hoursContributed: 98.3,
      totalVnsEarned: 1123.89,
      currentStreak: 3,
      contributorRank: 'Builder',
      isOnline: true
    }
  ];

  const leaderboard = (leaderboardData as LeaderboardEntry[]) || mockData;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-white/60">#{rank}</span>;
  };

  const getRankColor = (contributorRank: string) => {
    switch (contributorRank) {
      case 'Visionary': return 'bg-purple-400/20 text-purple-400';
      case 'Architect': return 'bg-blue-400/20 text-blue-400';
      case 'Builder': return 'bg-lime-400/20 text-lime-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-white border text-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-lime-600" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={timeFilter} onValueChange={(value) => setTimeFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="today" className="text-white data-[state=active]:bg-lime-400 data-[state=active]:text-black">
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="text-white data-[state=active]:bg-lime-400 data-[state=active]:text-black">
              This Week
            </TabsTrigger>
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-lime-400 data-[state=active]:text-black">
              All Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value={timeFilter} className="space-y-4 mt-6">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar and Status */}
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${entry.username}`} />
                    <AvatarFallback className="bg-lime-400/20 text-lime-400">
                      {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {entry.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{entry.username}</span>
                    <Badge className={getRankColor(entry.contributorRank)}>
                      {entry.contributorRank}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/60">
                    {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-right">
                  <div>
                    <div className="flex items-center gap-1 text-orange-400 text-sm">
                      <Clock className="w-3 h-3" />
                      {entry.hoursContributed.toFixed(1)}h
                    </div>
                    <div className="text-xs text-white/50">Hours</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-lime-400 text-sm">
                      <Coins className="w-3 h-3" />
                      {entry.totalVnsEarned.toFixed(0)}
                    </div>
                    <div className="text-xs text-white/50">VNS</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-blue-400 text-sm">
                      <Zap className="w-3 h-3" />
                      {entry.currentStreak}
                    </div>
                    <div className="text-xs text-white/50">Streak</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-mono text-yellow-400">
              {leaderboard.length}
            </div>
            <div className="text-xs text-white/60">Active Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono text-lime-400">
              {leaderboard.reduce((sum, entry) => sum + entry.hoursContributed, 0).toFixed(0)}h
            </div>
            <div className="text-xs text-white/60">Total Hours</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono text-purple-400">
              {leaderboard.reduce((sum, entry) => sum + entry.totalVnsEarned, 0).toFixed(0)}
            </div>
            <div className="text-xs text-white/60">VNS Earned</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}