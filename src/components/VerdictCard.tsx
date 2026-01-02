import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetectionResult } from '@/store/analysisStore';

interface VerdictCardProps {
  result: DetectionResult;
}

export function VerdictCard({ result }: VerdictCardProps) {
  const getVerdictConfig = () => {
    switch (result.verdict) {
      case 'fake':
        return {
          icon: ShieldAlert,
          title: 'LIKELY MANIPULATED MEDIA',
          subtitle: 'High Risk Detected',
          bgClass: 'bg-gradient-danger',
          borderClass: 'border-destructive/50',
          glowClass: 'border-glow-danger',
          textClass: 'text-destructive text-glow-danger',
          iconClass: 'text-destructive',
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          title: 'SUSPICIOUS CONTENT',
          subtitle: 'Requires Further Verification',
          bgClass: 'bg-gradient-to-br from-warning/10 to-transparent',
          borderClass: 'border-warning/50',
          glowClass: '',
          textClass: 'text-warning text-glow-warning',
          iconClass: 'text-warning',
        };
      case 'authentic':
        return {
          icon: ShieldCheck,
          title: 'LIKELY AUTHENTIC',
          subtitle: 'Low Risk Detected',
          bgClass: 'bg-gradient-success',
          borderClass: 'border-success/50',
          glowClass: 'border-glow-success',
          textClass: 'text-success text-glow-success',
          iconClass: 'text-success',
        };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <div className={cn(
        "relative rounded-xl border-2 overflow-hidden",
        config.bgClass,
        config.borderClass,
        config.glowClass
      )}>
        {/* Scan lines effect */}
        <div className="absolute inset-0 scanlines opacity-30" />

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-current opacity-20 blur-xl rounded-full"
                style={{ color: result.verdict === 'fake' ? 'hsl(0, 75%, 55%)' : result.verdict === 'authentic' ? 'hsl(142, 70%, 45%)' : 'hsl(38, 95%, 55%)' }}
              />
              <Icon className={cn("relative h-12 w-12", config.iconClass)} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className={cn("font-mono text-2xl font-bold tracking-wider", config.textClass)}>
              {config.title}
            </h2>
            <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              {config.subtitle}
            </p>
          </div>

          {/* Score Display */}
          <div className="mt-8 flex items-center justify-center">
            <div className="relative">
              {/* Background ring */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={config.iconClass}
                  initial={{ strokeDasharray: '0 352' }}
                  animate={{ strokeDasharray: `${result.overallScore * 3.52} 352` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              
              {/* Score number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={cn("font-mono text-4xl font-bold", config.textClass)}
                >
                  {result.overallScore}
                </motion.span>
                <span className="font-mono text-xs text-muted-foreground">/100</span>
              </div>
            </div>
          </div>

          {/* Confidence & Models */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-foreground">
                {result.confidence}%
              </p>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Confidence
              </p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-foreground">
                {result.modelsAgreed}/{result.totalModels}
              </p>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Models Agree
              </p>
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-current opacity-50 rounded-tl-xl" style={{ color: result.verdict === 'fake' ? 'hsl(0, 75%, 55%)' : result.verdict === 'authentic' ? 'hsl(142, 70%, 45%)' : 'hsl(38, 95%, 55%)' }} />
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-current opacity-50 rounded-tr-xl" style={{ color: result.verdict === 'fake' ? 'hsl(0, 75%, 55%)' : result.verdict === 'authentic' ? 'hsl(142, 70%, 45%)' : 'hsl(38, 95%, 55%)' }} />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-current opacity-50 rounded-bl-xl" style={{ color: result.verdict === 'fake' ? 'hsl(0, 75%, 55%)' : result.verdict === 'authentic' ? 'hsl(142, 70%, 45%)' : 'hsl(38, 95%, 55%)' }} />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-current opacity-50 rounded-br-xl" style={{ color: result.verdict === 'fake' ? 'hsl(0, 75%, 55%)' : result.verdict === 'authentic' ? 'hsl(142, 70%, 45%)' : 'hsl(38, 95%, 55%)' }} />
      </div>
    </motion.div>
  );
}
