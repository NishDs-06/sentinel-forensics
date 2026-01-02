import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisStage } from '@/store/analysisStore';

interface AnalysisProgressProps {
  stages: AnalysisStage[];
  currentStage: number;
}

export function AnalysisProgress({ stages, currentStage }: AnalysisProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl" />
        
        {/* Card */}
        <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
                  Analysis in Progress
                </h3>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {stages[currentStage]?.name || 'Processing...'}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                <div className="relative w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              </div>
            </div>
          </div>

          {/* Stages */}
          <div className="p-6 space-y-4">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative flex items-center gap-4 p-4 rounded-lg border transition-all duration-300",
                  stage.status === 'complete' && "bg-success/5 border-success/30",
                  stage.status === 'running' && "bg-primary/5 border-primary/30",
                  stage.status === 'pending' && "bg-secondary/50 border-border",
                  stage.status === 'error' && "bg-destructive/5 border-destructive/30"
                )}
              >
                {/* Status Icon */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                  stage.status === 'complete' && "bg-success/20 border-success text-success",
                  stage.status === 'running' && "bg-primary/20 border-primary text-primary",
                  stage.status === 'pending' && "bg-secondary border-border text-muted-foreground",
                  stage.status === 'error' && "bg-destructive/20 border-destructive text-destructive"
                )}>
                  {stage.status === 'complete' && <Check className="h-5 w-5" />}
                  {stage.status === 'running' && <Loader2 className="h-5 w-5 animate-spin" />}
                  {stage.status === 'pending' && <span className="font-mono text-sm">{index + 1}</span>}
                  {stage.status === 'error' && <AlertCircle className="h-5 w-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className={cn(
                      "font-mono text-sm truncate",
                      stage.status === 'complete' && "text-success",
                      stage.status === 'running' && "text-primary",
                      stage.status === 'pending' && "text-muted-foreground",
                      stage.status === 'error' && "text-destructive"
                    )}>
                      {stage.name}
                    </span>
                    {stage.status === 'running' && (
                      <span className="font-mono text-xs text-primary">
                        {stage.progress}%
                      </span>
                    )}
                    {stage.status === 'complete' && stage.result && (
                      <span className="font-mono text-xs text-success">
                        {stage.result}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {stage.status === 'running' && (
                    <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary progress-glow"
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>

                {/* Chevron */}
                {stage.status === 'complete' && (
                  <ChevronRight className="h-4 w-4 text-success" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer message */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span>Processing with hybrid edge + cloud analysis engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
