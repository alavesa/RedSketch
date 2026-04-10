import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { homedir } from "node:os";
import { z } from "zod";
import { DEFAULT_CONFIG, type RedSketchConfig } from "../types/index.js";
import { log } from "../utils/logger.js";

const configSchema = z.object({
  apiKey: z.string().optional(),
  figmaToken: z.string().optional(),
  model: z.string().optional(),
  maxTokens: z.number().positive().optional(),
  temperature: z.number().min(0).max(1).optional(),
});

function findConfigFile(startDir: string): string | null {
  let dir = resolve(startDir);
  while (true) {
    const configPath = resolve(dir, ".redsketch.json");
    if (existsSync(configPath)) return configPath;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function loadFileConfig(startDir: string): Partial<RedSketchConfig> {
  const configPath = findConfigFile(startDir);
  if (!configPath) return {};
  try {
    return configSchema.parse(JSON.parse(readFileSync(configPath, "utf-8")));
  } catch (error) {
    log.warn(`Failed to parse ${configPath}: ${error instanceof Error ? error.message : "invalid JSON"}. Using defaults.`);
    return {};
  }
}

function loadGlobalConfig(): Partial<RedSketchConfig> {
  const globalPath = resolve(homedir(), ".redsketch.json");
  if (!existsSync(globalPath)) return {};
  try {
    return configSchema.parse(JSON.parse(readFileSync(globalPath, "utf-8")));
  } catch (error) {
    log.warn(`Failed to parse ${globalPath}: ${error instanceof Error ? error.message : "invalid JSON"}. Using defaults.`);
    return {};
  }
}

export interface CLIOptions {
  model?: string;
}

export function loadConfig(cliOptions: CLIOptions = {}): RedSketchConfig {
  const globalConfig = loadGlobalConfig();
  const fileConfig = loadFileConfig(process.cwd());

  // API key: env var > file config > global config
  const apiKey =
    process.env.ANTHROPIC_API_KEY ??
    fileConfig.apiKey ??
    globalConfig.apiKey ??
    "";

  if (!apiKey) {
    throw new Error(
      "Missing API key. Set ANTHROPIC_API_KEY environment variable or add apiKey to .redsketch.json"
    );
  }

  if (!process.env.ANTHROPIC_API_KEY && (fileConfig.apiKey || globalConfig.apiKey)) {
    log.warn("API key loaded from config file. For better security, use ANTHROPIC_API_KEY environment variable.");
  }

  // Figma token: env var > file config > global config
  const figmaToken =
    process.env.FIGMA_ACCESS_TOKEN ??
    fileConfig.figmaToken ??
    globalConfig.figmaToken ??
    "";

  if (!figmaToken) {
    throw new Error(
      "Missing Figma token. Set FIGMA_ACCESS_TOKEN environment variable or add figmaToken to .redsketch.json"
    );
  }

  return {
    ...DEFAULT_CONFIG,
    ...globalConfig,
    ...fileConfig,
    ...(cliOptions.model ? { model: cliOptions.model } : {}),
    apiKey,
    figmaToken,
  };
}
