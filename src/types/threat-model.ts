export type StrideCategory =
  | "spoofing"
  | "tampering"
  | "repudiation"
  | "information-disclosure"
  | "denial-of-service"
  | "elevation-of-privilege";

export type AssetType =
  | "authentication-flow"
  | "data-input-form"
  | "file-upload"
  | "payment-flow"
  | "admin-panel"
  | "user-settings"
  | "consent-screen"
  | "data-display"
  | "navigation"
  | "search"
  | "messaging"
  | "notification-system"
  | "other";

export type SeverityLevel = "critical" | "high" | "medium" | "low";
export type RiskScore = "critical" | "high" | "medium" | "low" | "none";
export type PatternRelevance = "directly-applicable" | "recommended" | "consider";

export interface ThreatModelAsset {
  id: string;
  name: string;
  type: AssetType;
  figmaNodePath: string;
  description: string;
  sensitivityLevel: SeverityLevel;
}

export interface ThreatModelThreat {
  assetId: string;
  strideCategory: StrideCategory;
  title: string;
  description: string;
  severity: SeverityLevel;
  likelihood: "high" | "medium" | "low";
  attackScenario: string;
  missingControls: string[];
}

export interface ThreatModelPatternMatch {
  patternId: string;
  patternLabel: string;
  category: string;
  relevance: PatternRelevance;
  reason: string;
  url: string;
}

export interface ThreatModelComplianceGap {
  regulation: string;
  regulationFullName: string;
  gap: string;
  severity: SeverityLevel;
  requiredPatterns: string[];
}

export interface ThreatModelResult {
  designSummary: string;
  assets: ThreatModelAsset[];
  threats: ThreatModelThreat[];
  patternMatches: ThreatModelPatternMatch[];
  complianceGaps: ThreatModelComplianceGap[];
  riskScore: RiskScore;
  summary: string;
}
