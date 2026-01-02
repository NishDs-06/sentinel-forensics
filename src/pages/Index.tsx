import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import { SourceInfoForm } from '@/components/SourceInfoForm';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { useAnalysisStore, MediaFile, SourceInfo } from '@/store/analysisStore';
import {
  extractMetadata,
  calculateProvenanceScore,
  runEdgeDetection,
  runCloudAnalysis,
  calculateCompressionScore,
  generateFinalResult,
  generateTimelineData,
  generateAnomalies,
  generateHeatmapData
} from '@/lib/analysisEngine';

type AppState = 'upload' | 'source' | 'analyzing' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const store = useAnalysisStore();

  const handleFileAccepted = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';

    store.setMediaFile({ file, preview, type });
    setAppState('source');
  }, [store]);

  const handleSourceSubmit = useCallback(async (sourceInfo: SourceInfo) => {
    store.setSourceInfo(sourceInfo);
    store.setIsAnalyzing(true);
    store.resetStages();
    setAppState('analyzing');

    try {
      // Stage 1: Extract Metadata
      store.updateStage(0, { status: 'running', progress: 0 });
      const metadata = await extractMetadata(store.mediaFile!.file);
      store.setMetadata(metadata);
      store.updateStage(0, { status: 'complete', progress: 100, result: `Score: ${metadata.integrityScore}` });

      // Stage 2: Edge Detection
      store.setCurrentStage(1);
      store.updateStage(1, { status: 'running', progress: 0 });
      const edgeResult = await runEdgeDetection((progress) => {
        store.updateStage(1, { progress });
      });
      store.updateStage(1, {
        status: 'complete',
        progress: 100,
        result: edgeResult.confidence < 80 ? 'Escalating...' : `${edgeResult.confidence}% confidence`
      });

      // Stage 3: Cloud Analysis (if edge confidence < 80%)
      store.setCurrentStage(2);
      store.updateStage(2, { status: 'running', progress: 0 });
      const cloudResult = await runCloudAnalysis((progress) => {
        store.updateStage(2, { progress });
      });
      store.updateStage(2, {
        status: 'complete',
        progress: 100,
        result: `${cloudResult.modelsAgreed}/3 models agree`
      });

      // Stage 4: Provenance Scoring
      store.setCurrentStage(3);
      store.updateStage(3, { status: 'running', progress: 50 });
      const provenanceScore = calculateProvenanceScore(sourceInfo);
      await new Promise(resolve => setTimeout(resolve, 500));
      store.updateStage(3, { status: 'complete', progress: 100, result: `Score: ${provenanceScore}` });

      // Stage 5: Generate Report
      store.setCurrentStage(4);
      store.updateStage(4, { status: 'running', progress: 0 });

      // Calculate compression score
      const compressionScore = calculateCompressionScore();

      // Generate final result
      const finalResult = generateFinalResult(
        cloudResult.score,
        metadata.integrityScore,
        provenanceScore,
        compressionScore,
        cloudResult.confidence,
        cloudResult.modelsAgreed
      );
      store.setDetectionResult(finalResult);

      // Generate timeline and anomaly data
      const timelineData = generateTimelineData(30);
      store.setTimelineData(timelineData);
      store.setAnomalies(generateAnomalies(timelineData));

      // Generate heatmap
      store.setHeatmapData(generateHeatmapData());

      await new Promise(resolve => setTimeout(resolve, 800));
      store.updateStage(4, { status: 'complete', progress: 100, result: 'Report ready' });

      // Show results
      store.setIsAnalyzing(false);
      setAppState('results');

    } catch (error) {
      console.error('Analysis failed:', error);
      store.setIsAnalyzing(false);
      setAppState('upload');
    }
  }, [store]);

  const handleBack = useCallback(() => {
    store.reset();
    setAppState('upload');
  }, [store]);

  return (
    <div className="min-h-screen bg-background grid-overlay">
      <Header currentPage="upload" />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="text-foreground">Deepfake</span>{' '}
                    <span className="text-primary text-glow">Detection</span>
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  AI-powered authenticity verification with hybrid edge + cloud analysis,
                  metadata forensics, and explainable results.
                </motion.p>
              </div>

              {/* Upload Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <UploadZone onFileSelected={handleFileAccepted} onResult={() => { }} />
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
              >
                {[
                  {
                    title: 'Hybrid Detection',
                    description: 'Edge + Cloud ML models for fast, accurate results',
                  },
                  {
                    title: 'Metadata Forensics',
                    description: 'EXIF analysis, provenance tracking, compression detection',
                  },
                  {
                    title: 'Visual Explainability',
                    description: 'Heatmaps, timelines, and detailed breakdowns',
                  },
                ].map((feature, index) => (
                  <div
                    key={feature.title}
                    className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <h3 className="font-mono text-sm font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {appState === 'source' && store.mediaFile && (
            <motion.div
              key="source"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Media Preview */}
              <div className="max-w-md mx-auto">
                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-secondary">
                  {store.mediaFile.type === 'video' ? (
                    <video
                      src={store.mediaFile.preview}
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <img
                      src={store.mediaFile.preview}
                      alt="Uploaded media"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <p className="mt-2 text-center font-mono text-xs text-muted-foreground">
                  {store.mediaFile.file.name}
                </p>
              </div>

              {/* Source Info Form */}
              <SourceInfoForm onSubmit={handleSourceSubmit} />
            </motion.div>
          )}

          {appState === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnalysisProgress
                stages={store.stages}
                currentStage={store.currentStage}
              />
            </motion.div>
          )}

          {appState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResultsDashboard onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
