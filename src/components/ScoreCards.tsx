import { motion } from 'framer-motion';
import { Bot, FileText, Link, Archive, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetectionResult } from '@/store/analysisStore';

interface ScoreCardsProps {
  result: DetectionResult;
}

interface ScoreCardData {
  id: string;
  title: string;
  icon: typeof Bot;
  score: number;
  status: string;
  detail: string;
}

export function ScoreCards({ result }: ScoreCardsProps) {
  const cards: ScoreCardData[] = [
    {
      id: 'ml',
      title: 'ML ANALYSIS',
      icon: Bot,
      score: result.mlScore,
      status: result.mlScore < 40 ? 'FAKE' : result.mlScore < 70 ? 'SUSPICIOUS' : 'AUTHENTIC',
      detail: `${result.modelsAgreed}/${result.totalModels} models agree`,
    },
    {
      id: 'metadata',
      title: 'METADATA',
      icon: FileText,
      score: result.metadataScore,
      status: result.metadataScore < 40 ? 'CORRUPTED' : result.metadataScore < 70 ? 'SUSPICIOUS' : 'VALID',
      detail: result.metadataScore < 50 ? 'Issues detected' : 'Consistent data',
    },
    {
      id: 'provenance',
      title: 'SOURCE CHAIN',
      icon: Link,
      score: result.provenanceScore,
      status: result.provenanceScore < 40 ? 'UNRELIABLE' : result.provenanceScore < 70 ? 'UNCERTAIN' : 'VERIFIED',
      detail: result.provenanceScore < 50 ? 'Chain of custody unclear' : 'Source documented',
    },
    {
      id: 'compression',
      title: 'COMPRESSION',
      icon: Archive,
      score: result.compressionScore,
      status: result.compressionScore < 40 ? 'DEGRADED' : result.compressionScore < 70 ? 'RE-ENCODED' : 'PRISTINE',
      detail: result.compressionScore < 50 ? 'Multiple re-encodings' : 'Minimal compression artifacts',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-destructive';
    if (score < 70) return 'text-warning';
    return 'text-success';
  };

  const getStatusColor = (score: number) => {
    if (score < 40) return 'bg-destructive/20 text-destructive border-destructive/30';
    if (score < 70) return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-success/20 text-success border-success/30';
  };

  const getTrendIcon = (score: number) => {
    return score < 50 ? TrendingDown : TrendingUp;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const TrendIcon = getTrendIcon(card.score);
        
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="relative rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <card.icon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      {card.title}
                    </span>
                  </div>
                  <TrendIcon className={cn("h-4 w-4", getScoreColor(card.score))} />
                </div>
              </div>

              {/* Score */}
              <div className="p-4">
                <div className="flex items-baseline gap-1">
                  <span className={cn("font-mono text-3xl font-bold", getScoreColor(card.score))}>
                    {card.score}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">/100</span>
                </div>

                {/* Status badge */}
                <div className={cn(
                  "mt-3 inline-flex items-center px-2 py-1 rounded text-xs font-mono uppercase tracking-wider border",
                  getStatusColor(card.score)
                )}>
                  {card.status}
                </div>

                {/* Detail */}
                <p className="mt-3 text-xs text-muted-foreground">
                  {card.detail}
                </p>
              </div>

              {/* Progress bar at bottom */}
              <div className="h-1 bg-secondary">
                <motion.div
                  className={cn(
                    "h-full",
                    card.score < 40 ? 'bg-destructive' : card.score < 70 ? 'bg-warning' : 'bg-success'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${card.score}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
