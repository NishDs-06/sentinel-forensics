import { MetadataResult, DetectionResult, TimelineData, Anomaly, SourceInfo } from '@/store/analysisStore';

// Simulate delay for realistic processing feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Extract metadata from file (simulated with some real data)
export async function extractMetadata(file: File): Promise<MetadataResult> {
  await delay(800);
  
  const now = new Date();
  const randomDaysAgo = Math.floor(Math.random() * 30);
  const creationDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
  
  // Simulate various metadata scenarios
  const scenarios = [
    {
      issues: [
        { type: 'warning' as const, message: 'Creation date appears modified' },
        { type: 'error' as const, message: 'Device metadata stripped' },
        { type: 'warning' as const, message: 'Software: Adobe Premiere Pro detected' },
      ],
      integrityScore: 35,
      device: undefined,
      software: 'Adobe Premiere Pro 2024',
    },
    {
      issues: [
        { type: 'success' as const, message: 'Creation date consistent' },
        { type: 'success' as const, message: 'GPS coordinates valid' },
        { type: 'warning' as const, message: 'File has been re-encoded 2 times' },
      ],
      integrityScore: 72,
      device: 'iPhone 15 Pro',
      software: undefined,
    },
    {
      issues: [
        { type: 'error' as const, message: 'Future date detected (impossible)' },
        { type: 'error' as const, message: 'Device model inconsistent with format' },
        { type: 'warning' as const, message: 'Compression artifacts suggest manipulation' },
      ],
      integrityScore: 18,
      device: 'Samsung Galaxy S23',
      software: 'FFmpeg',
    },
  ];
  
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  return {
    creationDate: creationDate.toISOString(),
    modificationDate: now.toISOString(),
    device: scenario.device,
    software: scenario.software,
    gps: Math.random() > 0.5 ? { lat: 37.7749, lng: -122.4194 } : null,
    cameraSettings: scenario.device ? 'f/1.8, 1/120s, ISO 100' : undefined,
    issues: scenario.issues,
    integrityScore: scenario.integrityScore,
  };
}

// Calculate provenance score based on source info
export function calculateProvenanceScore(sourceInfo: SourceInfo): number {
  let score = 50; // Base score
  
  // Platform adjustments
  const platformScores: Record<string, number> = {
    'Direct Device': 40,
    'Email': 20,
    'WhatsApp': -10,
    'Twitter': -5,
    'Facebook': -10,
    'Telegram': -20,
    'Instagram': -5,
    'Unknown': -40,
  };
  
  score += platformScores[sourceInfo.platform] || 0;
  
  // Forward count penalty
  if (sourceInfo.forwardCount) {
    score -= Math.min(sourceInfo.forwardCount * 5, 30);
  }
  
  // URL presence bonus (original source documented)
  if (sourceInfo.url) {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Simulate edge detection (fast, lightweight)
export async function runEdgeDetection(
  onProgress: (progress: number) => void
): Promise<{ score: number; confidence: number }> {
  for (let i = 0; i <= 100; i += 5) {
    await delay(50);
    onProgress(i);
  }
  
  // Simulate result
  const score = Math.floor(Math.random() * 60) + 20; // 20-80 range
  const confidence = Math.floor(Math.random() * 30) + 50; // 50-80 range
  
  return { score, confidence };
}

// Simulate cloud deep analysis (slower, more accurate)
export async function runCloudAnalysis(
  onProgress: (progress: number) => void
): Promise<{ score: number; confidence: number; modelsAgreed: number }> {
  for (let i = 0; i <= 100; i += 2) {
    await delay(80);
    onProgress(i);
  }
  
  // Simulate result with higher confidence
  const isFake = Math.random() > 0.4; // 60% chance of detecting as fake
  const score = isFake ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 30) + 60;
  const confidence = Math.floor(Math.random() * 15) + 80; // 80-95 range
  const modelsAgreed = isFake ? (Math.random() > 0.3 ? 3 : 2) : (Math.random() > 0.5 ? 3 : 2);
  
  return { score, confidence, modelsAgreed };
}

// Calculate compression analysis score
export function calculateCompressionScore(): number {
  return Math.floor(Math.random() * 40) + 30; // 30-70 range
}

// Generate final detection result
export function generateFinalResult(
  mlScore: number,
  metadataScore: number,
  provenanceScore: number,
  compressionScore: number,
  confidence: number,
  modelsAgreed: number
): DetectionResult {
  // Weighted average
  const overallScore = Math.round(
    mlScore * 0.5 +
    metadataScore * 0.25 +
    provenanceScore * 0.15 +
    compressionScore * 0.1
  );
  
  let verdict: 'authentic' | 'suspicious' | 'fake';
  if (overallScore >= 70) {
    verdict = 'authentic';
  } else if (overallScore >= 40) {
    verdict = 'suspicious';
  } else {
    verdict = 'fake';
  }
  
  return {
    mlScore,
    metadataScore,
    provenanceScore,
    compressionScore,
    overallScore,
    verdict,
    confidence,
    modelsAgreed,
    totalModels: 3,
  };
}

// Generate timeline data for frame-by-frame analysis
export function generateTimelineData(durationSeconds: number = 30): TimelineData[] {
  const data: TimelineData[] = [];
  const framesPerSecond = 30;
  const totalFrames = durationSeconds * framesPerSecond;
  
  // Generate realistic-looking probability curve with some spikes
  let baseProbability = Math.random() * 40 + 20; // 20-60 base
  
  for (let frame = 0; frame < totalFrames; frame += 10) {
    // Add some variation
    const noise = (Math.random() - 0.5) * 15;
    
    // Occasionally add spikes (manipulation indicators)
    const hasSpike = Math.random() < 0.05;
    const spike = hasSpike ? Math.random() * 40 + 20 : 0;
    
    const probability = Math.max(0, Math.min(100, baseProbability + noise + spike));
    
    data.push({
      frame,
      timestamp: frame / framesPerSecond,
      probability: Math.round(probability),
    });
    
    // Slowly drift the base probability
    baseProbability += (Math.random() - 0.5) * 5;
    baseProbability = Math.max(10, Math.min(80, baseProbability));
  }
  
  return data;
}

// Generate anomalies based on timeline data
export function generateAnomalies(timelineData: TimelineData[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  
  // Find spikes in the data
  for (let i = 1; i < timelineData.length - 1; i++) {
    const prev = timelineData[i - 1].probability;
    const curr = timelineData[i].probability;
    const next = timelineData[i + 1].probability;
    
    // Detect sudden spikes
    if (curr - prev > 25 || curr - next > 25) {
      anomalies.push({
        frameStart: timelineData[i].frame,
        frameEnd: timelineData[i].frame + 15,
        type: 'Sudden probability spike',
        severity: curr > 70 ? 'high' : 'medium',
        description: `Significant change in deepfake probability detected at ${timelineData[i].timestamp.toFixed(1)}s`,
      });
    }
  }
  
  // Add some random anomalies for realism
  const randomAnomalies = [
    { type: 'Lighting inconsistency', description: 'Unnatural lighting shift detected' },
    { type: 'Face boundary artifact', description: 'Visible edge artifacts around facial region' },
    { type: 'Temporal discontinuity', description: 'Frame interpolation artifacts detected' },
    { type: 'Audio sync drift', description: 'Lip movement does not match audio waveform' },
    { type: 'Blink pattern anomaly', description: 'Unnatural eye blinking frequency detected' },
  ];
  
  const numRandomAnomalies = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numRandomAnomalies; i++) {
    const randomFrame = Math.floor(Math.random() * (timelineData.length - 20)) * 10;
    const randomAnomaly = randomAnomalies[Math.floor(Math.random() * randomAnomalies.length)];
    
    anomalies.push({
      frameStart: randomFrame,
      frameEnd: randomFrame + Math.floor(Math.random() * 30) + 10,
      type: randomAnomaly.type,
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      description: randomAnomaly.description,
    });
  }
  
  return anomalies.slice(0, 5); // Limit to 5 anomalies
}

// Generate heatmap data for suspicious regions
export function generateHeatmapData(width: number = 64, height: number = 48): number[][] {
  const data: number[][] = [];
  
  // Create base noise
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(Math.random() * 0.3); // Low base values
    }
    data.push(row);
  }
  
  // Add some hotspots (simulating face region detection)
  const addHotspot = (cx: number, cy: number, radius: number, intensity: number) => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (distance < radius) {
          const falloff = 1 - distance / radius;
          data[y][x] = Math.min(1, data[y][x] + intensity * falloff * falloff);
        }
      }
    }
  };
  
  // Add 2-4 hotspots
  const numHotspots = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < numHotspots; i++) {
    addHotspot(
      Math.floor(Math.random() * (width * 0.6) + width * 0.2),
      Math.floor(Math.random() * (height * 0.6) + height * 0.2),
      Math.floor(Math.random() * 10) + 8,
      Math.random() * 0.6 + 0.4
    );
  }
  
  return data;
}
