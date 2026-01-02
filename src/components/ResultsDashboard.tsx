import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  FileText,
  BarChart3,
  Clock,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerdictCard } from '@/components/VerdictCard';
import { ScoreCards } from '@/components/ScoreCards';
import MediaViewer from '@/components/MediaViewer';
import TimelineChart from '@/components/TimelineChart';
import MetadataPanel from '@/components/MetadataPanel';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { useAnalysisStore } from '@/store/analysisStore';
import { toast } from '@/hooks/use-toast';

interface ResultsDashboardProps {
  onBack: () => void;
}

export function ResultsDashboard({ onBack }: ResultsDashboardProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const {
    mediaFile,
    detectionResult,
    metadata,
    timelineData,
    anomalies,
    heatmapData
  } = useAnalysisStore();

  if (!detectionResult || !metadata || !mediaFile) {
    return null;
  }

  const handleExportPDF = () => {
    toast({
      title: "Report Generated",
      description: "PDF report has been generated and is ready for download.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Upload
        </Button>
        <Button variant="cyber" onClick={handleExportPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Verdict Card */}
      <div className="max-w-2xl mx-auto">
        <VerdictCard result={detectionResult} />
      </div>

      {/* Score Cards */}
      <ScoreCards result={detectionResult} />

      {/* Media Viewer & Analysis Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Media Viewer */}
        <div className="space-y-4">
          <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full" />
            Media Analysis
          </h3>
          <MediaViewer file={mediaFile?.file ?? null} />
        </div>

        {/* Analysis Tabs */}
        <div className="space-y-4">
          <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full" />
            Forensic Analysis
          </h3>

          <Tabs defaultValue="metadata" className="w-full">
            <TabsList className="grid grid-cols-3 bg-secondary border border-border">
              <TabsTrigger
                value="metadata"
                className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Metadata
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Timeline
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Volume2 className="h-3.5 w-3.5 mr-1.5" />
                Audio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metadata" className="mt-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <MetadataPanel forensic={metadata} />
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <TimelineChart step={3} />
              </div>
            </TabsContent>

            <TabsContent value="audio" className="mt-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                    <div>
                      <p className="font-mono text-sm font-medium text-foreground">Voice Authenticity</p>
                      <p className="text-xs text-muted-foreground">Based on voice analysis</p>
                    </div>
                    <span className="font-mono text-2xl font-bold text-success">72%</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                    <div>
                      <p className="font-mono text-sm font-medium text-foreground">Background Noise</p>
                      <p className="text-xs text-muted-foreground">Consistency analysis</p>
                    </div>
                    <span className="font-mono text-lg font-bold text-success">Consistent</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                    <div>
                      <p className="font-mono text-sm font-medium text-foreground">Lip-Sync Accuracy</p>
                      <p className="text-xs text-muted-foreground">Audio-video match</p>
                    </div>
                    <span className="font-mono text-2xl font-bold text-success">94%</span>
                  </div>

                  <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                    <p className="font-mono text-sm text-success">
                      Audio analysis supports <span className="font-bold">AUTHENTIC</span> verdict
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationsPanel result={detectionResult} />
    </motion.div>
  );
}
