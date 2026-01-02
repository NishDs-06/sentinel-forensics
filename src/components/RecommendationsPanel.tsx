import { motion } from 'framer-motion';
import { 
  AlertOctagon, 
  CheckSquare, 
  Share2, 
  Flag, 
  Search,
  FileText,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetectionResult } from '@/store/analysisStore';

interface RecommendationsPanelProps {
  result: DetectionResult;
}

interface Recommendation {
  icon: typeof AlertOctagon;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export function RecommendationsPanel({ result }: RecommendationsPanelProps) {
  const getRecommendations = (): Recommendation[] => {
    if (result.overallScore < 40) {
      // High risk - fake
      return [
        { icon: AlertOctagon, text: 'Do NOT share this media', priority: 'high' },
        { icon: Flag, text: 'Flag to platform moderators', priority: 'high' },
        { icon: Search, text: 'Request expert forensic review', priority: 'medium' },
        { icon: FileText, text: 'Document source for investigation', priority: 'medium' },
        { icon: Share2, text: 'Compare with known authentic versions', priority: 'low' },
      ];
    } else if (result.overallScore < 70) {
      // Medium risk - suspicious
      return [
        { icon: Search, text: 'Verify with original source', priority: 'high' },
        { icon: Share2, text: 'Cross-reference with other reports', priority: 'medium' },
        { icon: AlertTriangle, text: 'Note uncertainty in any reporting', priority: 'medium' },
        { icon: FileText, text: 'Seek additional verification', priority: 'low' },
      ];
    } else {
      // Low risk - authentic
      return [
        { icon: ShieldCheck, text: 'Media appears legitimate', priority: 'low' },
        { icon: CheckSquare, text: 'Standard verification protocols apply', priority: 'low' },
        { icon: FileText, text: 'Document analysis for records', priority: 'low' },
      ];
    }
  };

  const recommendations = getRecommendations();
  const isHighRisk = result.overallScore < 40;
  const isMediumRisk = result.overallScore >= 40 && result.overallScore < 70;

  return (
    <div className={cn(
      "p-6 rounded-xl border",
      isHighRisk && "bg-destructive/5 border-destructive/30",
      isMediumRisk && "bg-warning/5 border-warning/30",
      !isHighRisk && !isMediumRisk && "bg-success/5 border-success/30"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {isHighRisk && <AlertOctagon className="h-6 w-6 text-destructive" />}
        {isMediumRisk && <AlertTriangle className="h-6 w-6 text-warning" />}
        {!isHighRisk && !isMediumRisk && <ShieldCheck className="h-6 w-6 text-success" />}
        
        <h3 className={cn(
          "font-mono text-lg font-bold uppercase tracking-wider",
          isHighRisk && "text-destructive",
          isMediumRisk && "text-warning",
          !isHighRisk && !isMediumRisk && "text-success"
        )}>
          {isHighRisk && 'Recommended Actions'}
          {isMediumRisk && 'Recommended Actions'}
          {!isHighRisk && !isMediumRisk && 'Likely Authentic'}
        </h3>
      </div>

      {/* Recommendations list */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={cn(
              "flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center",
              rec.priority === 'high' && "border-destructive/50 text-destructive",
              rec.priority === 'medium' && "border-warning/50 text-warning",
              rec.priority === 'low' && "border-muted-foreground/50 text-muted-foreground"
            )}>
              <rec.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm text-foreground">{rec.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
