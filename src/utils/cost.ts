import chalk from "chalk";

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "claude-opus-4-6": { input: 5.0, output: 25.0 },
  "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  "claude-haiku-4-5": { input: 1.0, output: 5.0 },
};

const DEFAULT_PRICING = { input: 3.0, output: 15.0 };

interface UsageEntry {
  agent: string;
  model: string;
  input: number;
  output: number;
  cost: number;
}

export class CostTracker {
  private entries: UsageEntry[] = [];
  private defaultModel: string;

  constructor(model = "claude-sonnet-4-6") {
    this.defaultModel = model;
  }

  track(agentName: string, usage: { input: number; output: number }, model?: string): void {
    const m = model ?? this.defaultModel;
    const pricing = MODEL_PRICING[m] ?? DEFAULT_PRICING;
    const cost =
      (usage.input / 1_000_000) * pricing.input +
      (usage.output / 1_000_000) * pricing.output;
    this.entries.push({ agent: agentName, model: m, input: usage.input, output: usage.output, cost });
  }

  get totalCost(): number {
    return this.entries.reduce((sum, e) => sum + e.cost, 0);
  }

  get totalTokens(): { input: number; output: number } {
    return {
      input: this.entries.reduce((sum, e) => sum + e.input, 0),
      output: this.entries.reduce((sum, e) => sum + e.output, 0),
    };
  }

  formatSummary(): string {
    const lines: string[] = [];
    const totals = this.totalTokens;
    const cost = this.totalCost;

    lines.push("");
    lines.push(chalk.bold.underline("Cost Summary"));
    lines.push("");

    for (const entry of this.entries) {
      lines.push(
        `  ${chalk.red(entry.agent.padEnd(14))} ${chalk.gray(`${entry.input.toLocaleString()} in / ${entry.output.toLocaleString()} out`)} ${chalk.yellow(`$${entry.cost.toFixed(4)}`)}`,
      );
    }

    lines.push("");
    lines.push(
      `  ${chalk.bold("Total:")} ${totals.input.toLocaleString()} in / ${totals.output.toLocaleString()} out → ${chalk.yellow.bold(`$${cost.toFixed(4)}`)}`,
    );
    lines.push("");

    return lines.join("\n");
  }
}
