import type { Command } from "commander";
import { parseFigmaUrl } from "../../figma/url-parser.js";
import { FigmaReader, figmaDataToFileContent } from "../../figma/reader.js";
import { ThreatModelAgent } from "../../agents/threat-model.js";
import { LLMClient } from "../../core/llm-client.js";
import { loadConfig } from "../../core/config.js";
import { CostTracker } from "../../utils/cost.js";
import { log, setVerbose } from "../../utils/logger.js";
import { formatThreatModelResult } from "../../utils/formatter.js";
import { printBanner } from "../../utils/banner.js";
import { writeFileSync } from "node:fs";

export function registerScanCommand(program: Command): void {
  program
    .command("scan <figma-url>")
    .description("Generate a STRIDE threat model from a Figma design")
    .option("-r, --regulations <regs>", "Comma-separated regulation IDs to check (gdpr,nis2,pci,...)")
    .option("-m, --model <model>", "Claude model to use")
    .option("--json", "Output raw JSON to stdout", false)
    .option("-o, --output <path>", "Write JSON report to file")
    .option("-v, --verbose", "Show detailed output", false)
    .action(async (figmaUrl: string, opts: {
      regulations?: string;
      model?: string;
      json?: boolean;
      output?: string;
      verbose?: boolean;
    }) => {
      try {
        if (opts.verbose) setVerbose(true);
        if (!opts.json) printBanner();

        // 1. Load config
        const config = loadConfig({ model: opts.model });

        // 2. Parse Figma URL
        log.step("Parsing Figma URL...");
        const { fileKey, nodeId } = parseFigmaUrl(figmaUrl);
        log.verbose(`File: ${fileKey}, Node: ${nodeId ?? "(entire file)"}`);

        // 3. Read design structure
        log.step("Reading Figma design...");
        const reader = new FigmaReader(config.figmaToken);
        const designData = await reader.read(fileKey, nodeId);
        log.success(`Found ${designData.nodes.length} nodes, ${designData.textContent.length} text elements, ${designData.componentNames.length} components`);

        // 4. Convert to agent input
        const fileContent = figmaDataToFileContent(designData);

        // 5. Run threat model agent
        log.step("Analyzing design for security threats...");
        const llm = new LLMClient(config.apiKey, config.model);
        const regulations = opts.regulations?.split(",").map((r) => r.trim()) ?? [];
        const agent = new ThreatModelAgent(llm, regulations);

        const costTracker = new CostTracker(config.model);

        const result = await agent.execute(
          { files: [fileContent], config },
          opts.verbose ? (token) => process.stderr.write(chalk.dim(token)) : undefined,
        );

        costTracker.track("ThreatModel", result.tokensUsed, result.model);

        const data = result.data as import("../../types/threat-model.js").ThreatModelResult;

        // 6. Output
        if (opts.json) {
          // JSON to stdout (clean, no banner/logs)
          console.log(JSON.stringify(data, null, 2));
        } else {
          console.error(formatThreatModelResult(data));
          console.error(costTracker.formatSummary());
        }

        if (opts.output) {
          writeFileSync(opts.output, JSON.stringify(data, null, 2));
          log.success(`Report written to ${opts.output}`);
        }
      } catch (error) {
        log.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });
}

// Import chalk for verbose streaming (lazy import to avoid issues in non-TTY)
import chalk from "chalk";
