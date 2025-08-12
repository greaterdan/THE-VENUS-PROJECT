import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Award, Clock, Target, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContributorStatusProps {
  rank: 'Explorer' | 'Builder' | 'Architect' | 'Visionary';
  badges: string[];
  hoursContributed: number;
  nextRankRequirement: number;
  dailyGoal: number;
  todaysProgress: number;
}

export function ContributorStatus({
  rank,
  badges,
  hoursContributed,
  nextRankRequirement,
  dailyGoal,
  todaysProgress
}: ContributorStatusProps) {
  const getRankInfo = (rank: string) => {
    switch (rank) {
      case 'Visionary':
        return {
          color: 'from-purple-500 to-pink-500',
          textColor: 'text-purple-400',
          bgColor: 'bg-purple-400/20',
          icon: <Trophy className="w-5 h-5" />,
          description: 'Master of the Venus AI ecosystem'
        };
      case 'Architect':
        return {
          color: 'from-blue-500 to-cyan-500',
          textColor: 'text-blue-400',
          bgColor: 'bg-blue-400/20',
          icon: <Target className="w-5 h-5" />,
          description: 'Advanced infrastructure contributor'
        };
      case 'Builder':
        return {
          color: 'from-lime-500 to-green-500',
          textColor: 'text-lime-400',
          bgColor: 'bg-lime-400/20',
          icon: <Zap className="w-5 h-5" />,
          description: 'Dedicated network contributor'
        };
      default:
        return {
          color: 'from-gray-500 to-slate-500',
          textColor: 'text-gray-400',
          bgColor: 'bg-gray-400/20',
          icon: <Star className="w-5 h-5" />,
          description: 'New to the Venus network'
        };
    }
  };

  const rankInfo = getRankInfo(rank);
  const progressToNext = (hoursContributed / nextRankRequirement) * 100;
  const dailyProgressPercent = (todaysProgress / dailyGoal) * 100;

  const availableBadges = [
    { name: '100 hours uptime', icon: '⏰', achieved: badges.includes('100_hours') },
    { name: '1,000 decisions processed', icon: '🧠', achieved: badges.includes('1000_decisions') },
    { name: 'Week streak master', icon: '🔥', achieved: badges.includes('week_streak') },
    { name: 'Top 10 contributor', icon: '🏆', achieved: badges.includes('top_10') },
    { name: 'Early adopter', icon: '⭐', achieved: badges.includes('early_adopter') },
    { name: 'GPU powerhouse', icon: '⚡', achieved: badges.includes('gpu_power') }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-lime-400" />
          Contributor Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Rank */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${rankInfo.color} flex items-center justify-center mb-2`}
          >
            <div className={rankInfo.textColor}>
              {rankInfo.icon}
            </div>
          </motion.div>
          
          <div>
            <h3 className="text-xl font-bold mb-1">{rank}</h3>
            <p className="text-sm text-white/60">{rankInfo.description}</p>
          </div>
          
          <Badge className={`${rankInfo.bgColor} ${rankInfo.textColor}`}>
            {hoursContributed.toFixed(1)} hours contributed
          </Badge>
        </div>

        {/* Progress to Next Rank */}
        {rank !== 'Visionary' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to next rank</span>
              <span className={rankInfo.textColor}>
                {hoursContributed.toFixed(1)} / {nextRankRequirement} hours
              </span>
            </div>
            <Progress value={Math.min(progressToNext, 100)} className="h-2" />
            <p className="text-xs text-white/50">
              {Math.max(0, nextRankRequirement - hoursContributed).toFixed(1)} hours remaining
            </p>
          </div>
        )}

        {/* Daily Goal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Today's Goal
            </span>
            <span className="text-lime-400">
              {todaysProgress.toFixed(1)} / {dailyGoal}h
            </span>
          </div>
          <Progress value={Math.min(dailyProgressPercent, 100)} className="h-2" />
          {todaysProgress >= dailyGoal && (
            <Badge className="bg-green-400/20 text-green-400 w-fit">
              <Trophy className="w-3 h-3 mr-1" />
              Daily goal achieved!
            </Badge>
          )}
        </div>

        {/* Badges */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Achievement Badges</h4>
          <div className="grid grid-cols-3 gap-2">
            {availableBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg text-center transition-all duration-300 ${
                  badge.achieved
                    ? 'bg-lime-400/20 border border-lime-400/30 text-lime-400'
                    : 'bg-white/5 border border-white/10 text-white/40'
                }`}
              >
                <div className="text-lg mb-1">{badge.icon}</div>
                <div className="text-xs leading-tight">{badge.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Earnings Progress */}
        <div className="p-4 bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-lg border border-lime-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Daily Earnings</span>
            <span className="text-lime-400 font-mono">2.47 VNS</span>
          </div>
          <Progress value={65} className="h-2 mb-2" />
          <div className="text-xs text-white/60">
            On track for weekly target of 18.5 VNS
          </div>
        </div>
      </CardContent>
    </Card>
  );
}