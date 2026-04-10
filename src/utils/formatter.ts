import chalk from "chalk";
import type { ThreatModelResult, SeverityLevel } from "../types/threat-model.js";

const SEVERITY_COLORS: Record<SeverityLevel, (text: string) => string> = {
  critical: chalk.red.bold,
  high: chalk.red,
  medium: chalk.yellow,
  low: chalk.blue,
};

const SEVERITY_ICONS: Record<SeverityLevel, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🔵",
};

const STRIDE_ICONS: Record<string, string> = {
  spoofing: "👤",
  tampering: "🔧",
  repudiation: "📝",
  "information-disclosure": "👁",
  "denial-of-service": "🚫",
  "elevation-of-privilege": "⬆",
};

const RELEVANCE_ICONS: Record<string, string> = {
  "directly-applicable": "✅",
  recommended: "⭐",
  consider: "💡",
};

const RISK_COLORS: Record<string, (text: string) => string> = {
  critical: chalk.bgRed.white.bold,
  high: chalk.red.bold,
  medium: chalk.yellow.bold,
  low: chalk.blue.bold,
  none: chalk.green.bold,
};

export function formatThreatModelResult(result: ThreatModelResult): string {
  const lines: string[] = [];
  const bar = chalk.red("═".repeat(60));

  lines.push("");
  lines.push(bar);
  lines.push(chalk.red.bold("  RedSketch — Figma Threat Model Report"));
  lines.push(bar);
  lines.push("");

  // Design summary
  lines.push(chalk.gray(result.designSummary));
  lines.push("");

  // ── Assets ──────────────────────────────────────────────
  lines.push(chalk.bold.underline("Assets Identified"));
  lines.push("");

  if (result.assets.length === 0) {
    lines.push(chalk.gray("  No security-relevant assets identified."));
  } else {
    for (const asset of result.assets) {
      const icon = SEVERITY_ICONS[asset.sensitivityLevel];
      const color = SEVERITY_COLORS[asset.sensitivityLevel];
      lines.push(`  ${icon} ${chalk.bold(asset.name)} ${chalk.gray(`[${asset.type}]`)} ${color(asset.sensitivityLevel.toUpperCase())}`);
      lines.push(`     ${chalk.gray(asset.description)}`);
      lines.push(`     ${chalk.dim(`Node: ${asset.figmaNodePath}`)}`);
      lines.push("");
    }
  }

  // ── Threats ─────────────────────────────────────────────
  lines.push(chalk.bold.underline("STRIDE Threat Analysis"));
  lines.push(chalk.dim("  Spoofing · Tampering · Repudiation · Information Disclosure · Denial of Service · Elevation of Privilege"));
  lines.push("");

  if (result.threats.length === 0) {
    lines.push(chalk.green("  No threats identified."));
  } else {
    // Group threats by asset
    const assetMap = new Map<string, typeof result.threats>();
    for (const threat of result.threats) {
      const existing = assetMap.get(threat.assetId) ?? [];
      existing.push(threat);
      assetMap.set(threat.assetId, existing);
    }

    for (const [assetId, threats] of assetMap) {
      const asset = result.assets.find((a) => a.id === assetId);
      lines.push(`  ${chalk.bold(asset?.name ?? assetId)}`);

      for (const threat of threats) {
        const icon = STRIDE_ICONS[threat.strideCategory] ?? "⚠";
        const sevColor = SEVERITY_COLORS[threat.severity];
        lines.push(`    ${icon} ${sevColor(threat.title)} ${chalk.gray(`(${threat.strideCategory})`)} ${sevColor(threat.severity.toUpperCase())}`);
        lines.push(`       ${chalk.gray(threat.description)}`);
        lines.push(`       ${chalk.dim(`Attack: ${threat.attackScenario}`)}`);
        if (threat.missingControls.length > 0) {
          lines.push(`       ${chalk.yellow("Missing:")} ${threat.missingControls.join(", ")}`);
        }
        lines.push("");
      }
    }
  }

  // ── Pattern Matches ─────────────────────────────────────
  lines.push(chalk.bold.underline("Matched Security UX Patterns"));
  lines.push("");

  if (result.patternMatches.length === 0) {
    lines.push(chalk.gray("  No patterns matched."));
  } else {
    for (const match of result.patternMatches) {
      const icon = RELEVANCE_ICONS[match.relevance] ?? "•";
      lines.push(`  ${icon} ${chalk.bold(match.patternLabel)} ${chalk.gray(`(${match.relevance})`)} → ${chalk.cyan(match.url)}`);
      lines.push(`     ${chalk.gray(match.reason)}`);
      lines.push("");
    }
  }

  // ── Compliance Gaps ─────────────────────────────────────
  lines.push(chalk.bold.underline("Compliance Gaps"));
  lines.push("");

  if (result.complianceGaps.length === 0) {
    lines.push(chalk.green("  No compliance gaps detected."));
  } else {
    for (const gap of result.complianceGaps) {
      const icon = SEVERITY_ICONS[gap.severity];
      const sevColor = SEVERITY_COLORS[gap.severity];
      lines.push(`  ${icon} ${chalk.bold(gap.regulation)} ${sevColor(gap.severity.toUpperCase())}`);
      lines.push(`     ${chalk.gray(gap.gap)}`);
      if (gap.requiredPatterns.length > 0) {
        lines.push(`     ${chalk.yellow("Required:")} ${gap.requiredPatterns.join(", ")}`);
      }
      lines.push("");
    }
  }

  // ── Risk Score ──────────────────────────────────────────
  lines.push(bar);
  const riskColor = RISK_COLORS[result.riskScore] ?? chalk.white;
  lines.push(`  Risk Score: ${riskColor(` ${result.riskScore.toUpperCase()} `)}`);
  lines.push("");

  // Summary stats
  const threatCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const t of result.threats) threatCounts[t.severity]++;
  const countStr = Object.entries(threatCounts)
    .filter(([, n]) => n > 0)
    .map(([sev, n]) => SEVERITY_COLORS[sev as SeverityLevel](`${n} ${sev}`))
    .join(", ");

  lines.push(`  ${result.assets.length} assets · ${result.threats.length} threats${countStr ? ` (${countStr})` : ""} · ${result.patternMatches.length} patterns · ${result.complianceGaps.length} compliance gaps`);
  lines.push("");
  lines.push(`  ${chalk.gray(result.summary)}`);
  lines.push("");
  lines.push(bar);
  lines.push("");

  return lines.join("\n");
}
