import type { RedSketchConfig } from "./config.js";

export type { RedSketchConfig } from "./config.js";
export { DEFAULT_CONFIG } from "./config.js";
export type {
  ThreatModelResult,
  ThreatModelAsset,
  ThreatModelThreat,
  ThreatModelPatternMatch,
  ThreatModelComplianceGap,
  StrideCategory,
  AssetType,
  SeverityLevel,
  RiskScore,
  PatternRelevance,
} from "./threat-model.js";
export type { FigmaNode, FigmaDesignData } from "./figma.js";

export interface FileContent {
  path: string;
  content: string;
  language: string;
}

export interface AgentContext {
  files: FileContent[];
  config: RedSketchConfig;
}

export interface AgentResult {
  agentName: string;
  success: boolean;
  data: unknown;
  rawResponse: string;
  tokensUsed: { input: number; output: number };
  model?: string;
}
