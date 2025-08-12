import DecisionImpactAnalyzer from './impactAnalyzer';

interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  decision_id?: string;
  type: 'energy' | 'material' | 'data' | 'time';
}

interface SnapshotMetrics {
  ecological: number;
  wellbeing: number;
  efficiency: number;
  resilience: number;
  equity: number;
  innovation: number;
}

interface HourlySnapshot {
  id: string;
  timestamp_start: string;
  timestamp_end: string;
  decision_id: string;
  title: string;
  status: 'DEBATING' | 'VOTING' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED';
  participants: string[];
  metrics_delta: SnapshotMetrics;
  summary_line: string;
  transcript_lines: string[];
  created_at: Date;
}

class ArchiveSnapshotManager {
  private snapshots: HourlySnapshot[] = [];
  private messages: ChatMessage[] = [];
  private impactAnalyzer: DecisionImpactAnalyzer;
  private isCapturing = false;

  constructor() {
    this.impactAnalyzer = new DecisionImpactAnalyzer();
    this.startHourlyCapture();
  }

  // Store chat messages for snapshot processing
  addMessage(message: ChatMessage) {
    // Assign decision_id based on message content or use default
    const decision_id = this.inferDecisionId(message);
    const enrichedMessage = {
      ...message,
      decision_id,
      timestamp: new Date()
    };
    
    this.messages.push(enrichedMessage);
    
    // Keep only last 24 hours of messages
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.messages = this.messages.filter(msg => msg.timestamp > cutoff);
  }

  private inferDecisionId(message: ChatMessage): string {
    const text = message.message.toLowerCase();
    
    // Infer decision type from message content
    if (text.includes('energy') || text.includes('power') || text.includes('grid')) {
      return 'energy-reallocation';
    } else if (text.includes('transport') || text.includes('mobility') || text.includes('transit')) {
      return 'transport-optimization';
    } else if (text.includes('agriculture') || text.includes('food') || text.includes('farm')) {
      return 'agricultural-enhancement';
    } else if (text.includes('healthcare') || text.includes('medical') || text.includes('health')) {
      return 'healthcare-upgrade';
    } else if (text.includes('education') || text.includes('learning') || text.includes('curriculum')) {
      return 'education-framework';
    } else if (text.includes('resource') || text.includes('allocation') || text.includes('management')) {
      return 'resource-automation';
    }
    
    return 'general-coordination';
  }

  private startHourlyCapture() {
    // Calculate time until next hour
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    const msUntilNextHour = nextHour.getTime() - now.getTime();

    // Schedule first capture at top of next hour
    setTimeout(() => {
      this.captureHourlySnapshots();
      
      // Then run every hour
      setInterval(() => {
        this.captureHourlySnapshots();
      }, 60 * 60 * 1000);
    }, msUntilNextHour);

    console.log(`[ARCHIVE] Next hourly snapshot in ${Math.round(msUntilNextHour / 1000 / 60)} minutes`);
  }

  private async captureHourlySnapshots() {
    if (this.isCapturing) return;
    this.isCapturing = true;

    try {
      const now = new Date();
      const hourStart = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
      const hourEnd = new Date(now.getTime());

      console.log(`[ARCHIVE] Capturing snapshots for hour: ${hourStart.toISOString()} - ${hourEnd.toISOString()}`);

      // Get messages from the past hour
      const hourMessages = this.messages.filter(msg => 
        msg.timestamp >= hourStart && msg.timestamp < hourEnd
      );

      if (hourMessages.length === 0) {
        console.log('[ARCHIVE] No messages in past hour, skipping snapshot');
        this.isCapturing = false;
        return;
      }

      // Group messages by decision_id
      const messagesByDecision = new Map<string, ChatMessage[]>();
      hourMessages.forEach(msg => {
        const id = msg.decision_id || 'general-coordination';
        if (!messagesByDecision.has(id)) {
          messagesByDecision.set(id, []);
        }
        messagesByDecision.get(id)!.push(msg);
      });

      let snapshotCount = 0;

      // Create snapshot for each decision group
      const decisionIds = Array.from(messagesByDecision.keys());
      for (const decisionId of decisionIds) {
        const msgs = messagesByDecision.get(decisionId)!;
        if (msgs.length === 0) continue;

        const snapshot = await this.createSnapshot(decisionId, msgs, hourStart, hourEnd);
        this.snapshots.unshift(snapshot); // Add to beginning for reverse chronological order
        snapshotCount++;
      }

      console.log(`[ARCHIVE] Created ${snapshotCount} snapshots for ${messagesByDecision.size} decisions`);

      // Clean up old snapshots (keep 30 days)
      this.cleanupOldSnapshots();

    } catch (error) {
      console.error('[ARCHIVE] Error capturing snapshots:', error);
    } finally {
      this.isCapturing = false;
    }
  }

  private async createSnapshot(
    decisionId: string, 
    messages: ChatMessage[], 
    hourStart: Date, 
    hourEnd: Date
  ): Promise<HourlySnapshot> {
    // Calculate metrics delta for this hour
    const initialMetrics = this.impactAnalyzer.getCurrentMetrics();
    const tempAnalyzer = new DecisionImpactAnalyzer(initialMetrics);
    
    messages.forEach(msg => {
      tempAnalyzer.processMessage({ agent: msg.from, text: msg.message });
    });
    
    const finalMetrics = tempAnalyzer.getCurrentMetrics();
    const metrics_delta = {
      ecological: finalMetrics.ecological - initialMetrics.ecological,
      wellbeing: finalMetrics.wellbeing - initialMetrics.wellbeing,
      efficiency: finalMetrics.efficiency - initialMetrics.efficiency,
      resilience: finalMetrics.resilience - initialMetrics.resilience,
      equity: finalMetrics.equity - initialMetrics.equity,
      innovation: finalMetrics.innovation - initialMetrics.innovation
    };

    // Generate transcript lines in archive format
    const transcript_lines = messages.map(msg => {
      const time = msg.timestamp.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      const truncatedMsg = msg.message.length > 140 
        ? msg.message.substring(0, 137) + '...'
        : msg.message;
      return `[${time}] ${msg.from.toUpperCase()} ${truncatedMsg}`;
    });

    // Get unique participants
    const participants = Array.from(new Set(messages.map(msg => msg.from)));

    // Generate title and status based on decision type and content
    const { title, status } = this.generateTitleAndStatus(decisionId, messages, metrics_delta);

    // Create summary line
    const summary_line = this.generateSummaryLine(messages, metrics_delta, participants);

    return {
      id: `${decisionId}-${hourStart.getTime()}`,
      timestamp_start: hourStart.toISOString(),
      timestamp_end: hourEnd.toISOString(),
      decision_id: decisionId,
      title,
      status,
      participants,
      metrics_delta,
      summary_line,
      transcript_lines,
      created_at: new Date()
    };
  }

  private generateTitleAndStatus(
    decisionId: string, 
    messages: ChatMessage[], 
    delta: SnapshotMetrics
  ): { title: string; status: 'DEBATING' | 'VOTING' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED' } {
    const titles: Record<string, string> = {
      'energy-reallocation': 'Solar Array Recalibration',
      'transport-optimization': 'Transport Network Optimization', 
      'agricultural-enhancement': 'Agricultural Yield Enhancement',
      'healthcare-upgrade': 'Healthcare System Upgrade',
      'education-framework': 'Educational AI Ethics Framework',
      'resource-automation': 'Resource Recovery Automation Protocol',
      'general-coordination': 'General System Coordination'
    };

    const title = titles[decisionId] || 'System Coordination';

    // Determine status based on message patterns and impact
    const msgText = messages.map(m => m.message.toLowerCase()).join(' ');
    const totalImpact = Math.abs(delta.ecological) + Math.abs(delta.wellbeing) + 
                       Math.abs(delta.efficiency) + Math.abs(delta.resilience) + 
                       Math.abs(delta.equity) + Math.abs(delta.innovation);

    if (msgText.includes('implemented') || msgText.includes('deployed') || msgText.includes('active')) {
      return { title, status: 'IMPLEMENTED' };
    } else if (msgText.includes('approved') || msgText.includes('confirmed') || totalImpact > 5) {
      return { title, status: 'APPROVED' };
    } else if (msgText.includes('voting') || msgText.includes('decide') || msgText.includes('consensus')) {
      return { title, status: 'VOTING' };
    } else if (msgText.includes('rejected') || msgText.includes('cancelled') || totalImpact < -3) {
      return { title, status: 'REJECTED' };
    } else {
      return { title, status: 'DEBATING' };
    }
  }

  private generateSummaryLine(messages: ChatMessage[], delta: SnapshotMetrics, participants: string[]): string {
    const participantList = participants.length > 3 
      ? `${participants.slice(0, 3).join(', ')} +${participants.length - 3}`
      : participants.join(', ');

    // Find most significant metric change
    const deltas = [
      { name: 'Ecological', value: delta.ecological },
      { name: 'Wellbeing', value: delta.wellbeing },
      { name: 'Efficiency', value: delta.efficiency },
      { name: 'Resilience', value: delta.resilience },
      { name: 'Equity', value: delta.equity },
      { name: 'Innovation', value: delta.innovation }
    ];
    
    const maxDelta = deltas.reduce((max, curr) => 
      Math.abs(curr.value) > Math.abs(max.value) ? curr : max
    );

    const deltaStr = maxDelta.value !== 0 
      ? `${maxDelta.name}: ${maxDelta.value > 0 ? '+' : ''}${maxDelta.value.toFixed(1)}`
      : 'No impact';

    return `${participantList} | ${messages.length} messages | ${deltaStr}`;
  }

  private cleanupOldSnapshots() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const beforeCount = this.snapshots.length;
    this.snapshots = this.snapshots.filter(snapshot => snapshot.created_at > thirtyDaysAgo);
    const afterCount = this.snapshots.length;
    
    if (beforeCount !== afterCount) {
      console.log(`[ARCHIVE] Cleaned up ${beforeCount - afterCount} old snapshots`);
    }
  }

  // API methods
  getSnapshotHeaders(): Array<{
    id: string;
    timestamp: string;
    title: string;
    status: string;
    impact: string;
  }> {
    return this.snapshots.map(snapshot => ({
      id: snapshot.id,
      timestamp: new Date(snapshot.timestamp_start).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      title: snapshot.title,
      status: snapshot.status,
      impact: snapshot.summary_line
    }));
  }

  getSnapshotTranscript(id: string): string[] | null {
    const snapshot = this.snapshots.find(s => s.id === id);
    return snapshot ? snapshot.transcript_lines : null;
  }

  getSnapshotCount(): number {
    return this.snapshots.length;
  }
}

export default ArchiveSnapshotManager;