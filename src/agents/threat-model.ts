import { z } from "zod";
import { BaseAgent } from "./base-agent.js";
import type { AgentContext } from "../types/index.js";
import type { ThreatModelResult } from "../types/threat-model.js";
import { buildPatternKnowledgeBase } from "../data/security-ux-patterns.js";

const threatModelResultSchema = z.object({
  designSummary: z.string(),

  assets: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum([
        "authentication-flow", "data-input-form", "file-upload",
        "payment-flow", "admin-panel", "user-settings",
        "consent-screen", "data-display", "navigation",
        "search", "messaging", "notification-system", "other",
      ]),
      figmaNodePath: z.string(),
      description: z.string(),
      sensitivityLevel: z.enum(["critical", "high", "medium", "low"]),
    })
  ),

  threats: z.array(
    z.object({
      assetId: z.string(),
      strideCategory: z.enum([
        "spoofing", "tampering", "repudiation",
        "information-disclosure", "denial-of-service",
        "elevation-of-privilege",
      ]),
      title: z.string(),
      description: z.string(),
      severity: z.enum(["critical", "high", "medium", "low"]),
      likelihood: z.enum(["high", "medium", "low"]),
      attackScenario: z.string(),
      missingControls: z.array(z.string()),
    })
  ),

  patternMatches: z.array(
    z.object({
      patternId: z.string(),
      patternLabel: z.string(),
      category: z.string(),
      relevance: z.enum(["directly-applicable", "recommended", "consider"]),
      reason: z.string(),
      url: z.string(),
    })
  ),

  complianceGaps: z.array(
    z.object({
      regulation: z.string(),
      regulationFullName: z.string(),
      gap: z.string(),
      severity: z.enum(["critical", "high", "medium", "low"]),
      requiredPatterns: z.array(z.string()),
    })
  ),

  riskScore: z.enum(["critical", "high", "medium", "low", "none"]),
  summary: z.string(),
});

export class ThreatModelAgent extends BaseAgent<ThreatModelResult> {
  readonly name = "ThreatModel";
  readonly description = "Generates STRIDE threat models from Figma design structures";

  private targetRegulations: string[];

  constructor(
    llmClient: ConstructorParameters<typeof BaseAgent>[0],
    targetRegulations: string[] = [],
  ) {
    super(llmClient);
    this.targetRegulations = targetRegulations;
  }

  protected getOutputSchema() {
    return threatModelResultSchema;
  }

  protected getSystemPrompt(): string {
    const knowledgeBase = buildPatternKnowledgeBase();

    return `You are a senior security architect performing a UI-layer threat model on a Figma design. You have 20 years of experience in security UX and specialize in identifying security risks that originate from design decisions — before any code is written.

## Your Task

Analyze the Figma design structure provided and produce a comprehensive STRIDE-based threat model focused on UI-layer security.

## What to Look For

Scan the design for these security-relevant elements:
- **Authentication flows** — login forms, MFA screens, password reset, OAuth consent, passkey prompts
- **Data input forms** — any fields collecting user data (names, emails, addresses, payment info)
- **File upload interfaces** — drag-and-drop zones, file pickers, document upload areas
- **Payment/financial flows** — checkout, billing, subscription management
- **Admin/settings panels** — user settings, admin dashboards, role management
- **Consent screens** — cookie banners, privacy settings, permission requests, terms acceptance
- **Data display** — screens showing PII, account details, sensitive records
- **Navigation structure** — what access paths exist, how users move between privilege levels
- **AI features** — chatbots, AI-generated content, recommendation systems
- **Industrial/OT interfaces** — control panels, alarm displays, HMI screens

## STRIDE Framework — UI-Layer Threat Categories

For each identified asset, evaluate threats across all six STRIDE categories:

**Spoofing** (Identity) — Can the UI be impersonated? Is there a login form without visible anti-phishing measures? Could a fake version of this screen trick users?

**Tampering** (Data Integrity) — Can user-facing data be manipulated? Are there unprotected forms, editable fields without validation indicators, or missing integrity checks?

**Repudiation** (Accountability) — Can users deny actions? Is there an audit trail visible? Are confirmations shown for critical actions? Is there a transaction log?

**Information Disclosure** (Confidentiality) — Does the UI expose sensitive data? Are there PII fields without masking? Error messages that leak system details? Data visible that shouldn't be?

**Denial of Service** (Availability) — Can the UI be abused? Are there forms without rate limiting indicators? Missing CAPTCHA? Resource-intensive operations without feedback?

**Elevation of Privilege** (Authorization) — Does the UI suggest missing access controls? Are admin features reachable from user navigation? Are role boundaries visible?

## Pattern Matching

Use the Security UX Pattern Library below to match your findings against established patterns. For each relevant pattern:
- Link to the pattern URL on uxsec.dev
- Classify relevance: "directly-applicable" (design clearly needs this), "recommended" (would improve security posture), or "consider" (relevant edge case)
- Use the pattern's tags (OWASP, CWE references) to strengthen your analysis

## Compliance Gap Analysis

Check the design against applicable regulations. Flag gaps where the design is missing required security UX patterns. Be specific about which patterns are needed and why.

${this.targetRegulations.length > 0
    ? `Focus compliance analysis on these regulations: ${this.targetRegulations.join(", ")}`
    : "Check against all applicable regulations based on what the design contains."}

## Important Guidelines

- Focus on what IS and ISN'T visible in the design — this is a UI-layer analysis, not a code review
- Missing UI elements are findings (e.g., no MFA screen implies no MFA, no error states implies poor error handling)
- Be specific about Figma node paths when referencing design elements
- Severity should reflect real-world impact: authentication bypasses are critical, missing labels are low
- Every threat must have actionable missing controls
- Do NOT fabricate findings — only report what the design structure supports

## Security UX Pattern Library Knowledge Base

${knowledgeBase}`;
  }

  protected buildUserMessage(context: AgentContext): string {
    const parts = [
      "Analyze the following Figma design structure for security threats.\n",
    ];

    for (const file of context.files) {
      parts.push(`## Design: ${file.path}\n\n${file.content}\n`);
    }

    return parts.join("\n");
  }
}
