import { create } from 'zustand';

export interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export interface SourceInfo {
  platform: string;
  url?: string;
  forwardCount?: number;
  dateReceived?: string;
  location?: string;
}

export interface MetadataResult {
  creationDate?: string;
  modificationDate?: string;
  device?: string;
  software?: string;
  gps?: { lat: number; lng: number } | null;
  cameraSettings?: string;
  issues: Array<{
    type: 'success' | 'warning' | 'error';
    message: string;
  }>;
  integrityScore: number;
}

export interface AnalysisStage {
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  progress: number;
  result?: string;
}

export interface DetectionResult {
  mlScore: number;
  metadataScore: number;
  provenanceScore: number;
  compressionScore: number;
  overallScore: number;
  verdict: 'authentic' | 'suspicious' | 'fake';
  confidence: number;
  modelsAgreed: number;
  totalModels: number;
}

export interface TimelineData {
  frame: number;
  timestamp: number;
  probability: number;
}

export interface Anomaly {
  frameStart: number;
  frameEnd: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface AnalysisState {
  // Media
  mediaFile: MediaFile | null;
  setMediaFile: (file: MediaFile | null) => void;
  
  // Source Info
  sourceInfo: SourceInfo | null;
  setSourceInfo: (info: SourceInfo) => void;
  
  // Analysis State
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  
  stages: AnalysisStage[];
  updateStage: (index: number, updates: Partial<AnalysisStage>) => void;
  resetStages: () => void;
  
  // Results
  metadata: MetadataResult | null;
  setMetadata: (metadata: MetadataResult) => void;
  
  detectionResult: DetectionResult | null;
  setDetectionResult: (result: DetectionResult) => void;
  
  timelineData: TimelineData[];
  setTimelineData: (data: TimelineData[]) => void;
  
  anomalies: Anomaly[];
  setAnomalies: (anomalies: Anomaly[]) => void;
  
  heatmapData: number[][] | null;
  setHeatmapData: (data: number[][]) => void;
  
  // Reset
  reset: () => void;
}

const initialStages: AnalysisStage[] = [
  { name: 'Extracting Metadata', status: 'pending', progress: 0 },
  { name: 'Edge Detection', status: 'pending', progress: 0 },
  { name: 'Cloud Deep Analysis', status: 'pending', progress: 0 },
  { name: 'Provenance Scoring', status: 'pending', progress: 0 },
  { name: 'Generating Report', status: 'pending', progress: 0 },
];

export const useAnalysisStore = create<AnalysisState>((set) => ({
  // Media
  mediaFile: null,
  setMediaFile: (file) => set({ mediaFile: file }),
  
  // Source Info
  sourceInfo: null,
  setSourceInfo: (info) => set({ sourceInfo: info }),
  
  // Analysis State
  isAnalyzing: false,
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  
  currentStage: 0,
  setCurrentStage: (stage) => set({ currentStage: stage }),
  
  stages: initialStages,
  updateStage: (index, updates) => set((state) => ({
    stages: state.stages.map((stage, i) => 
      i === index ? { ...stage, ...updates } : stage
    ),
  })),
  resetStages: () => set({ stages: initialStages.map(s => ({ ...s, status: 'pending', progress: 0 })) }),
  
  // Results
  metadata: null,
  setMetadata: (metadata) => set({ metadata }),
  
  detectionResult: null,
  setDetectionResult: (result) => set({ detectionResult: result }),
  
  timelineData: [],
  setTimelineData: (data) => set({ timelineData: data }),
  
  anomalies: [],
  setAnomalies: (anomalies) => set({ anomalies }),
  
  heatmapData: null,
  setHeatmapData: (data) => set({ heatmapData: data }),
  
  // Reset
  reset: () => set({
    mediaFile: null,
    sourceInfo: null,
    isAnalyzing: false,
    currentStage: 0,
    stages: initialStages.map(s => ({ ...s, status: 'pending', progress: 0 })),
    metadata: null,
    detectionResult: null,
    timelineData: [],
    anomalies: [],
    heatmapData: null,
  }),
}));
