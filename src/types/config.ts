export interface RedSketchConfig {
  apiKey: string;
  figmaToken: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export const DEFAULT_CONFIG: Omit<RedSketchConfig, "apiKey" | "figmaToken"> = {
  model: "claude-sonnet-4-6",
  maxTokens: 16384,
  temperature: 1,
};
