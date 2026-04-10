# RedSketch

**Threat-model your Figma designs before writing a single line of code.**

RedSketch reads your Figma design files and generates STRIDE-based security threat models from the UI layer. It identifies authentication flows, data inputs, payment screens, consent patterns, and more — then maps them against 34 proven security UX patterns and 19 international regulations.

## Install

```bash
npm install -g redsketch
```

## Quick Start

```bash
# Set your API keys
export ANTHROPIC_API_KEY=sk-ant-...
export FIGMA_ACCESS_TOKEN=figd_...

# Scan a Figma design
redsketch scan "https://figma.com/design/abc123/MyApp?node-id=1-234"
```

## What It Does

1. **Reads** your Figma design structure via the Figma REST API
2. **Identifies** security-relevant UI elements (login forms, data inputs, file uploads, payment flows, consent screens, admin panels)
3. **Generates** STRIDE threat analysis for each identified asset
4. **Matches** findings against 34 Security UX patterns from [uxsec.dev](https://uxsec.dev)
5. **Flags** compliance gaps across 19 regulations (GDPR, NIS2, DORA, PCI DSS, EU AI Act, and more)

## Usage

```bash
# Basic scan
redsketch scan <figma-url>

# Focus on specific regulations
redsketch scan <figma-url> --regulations gdpr,nis2,pci

# JSON output for CI/CD pipelines
redsketch scan <figma-url> --json

# Write report to file
redsketch scan <figma-url> --output threat-model.json

# Use a specific Claude model
redsketch scan <figma-url> --model claude-opus-4-6

# Verbose output (shows AI thinking)
redsketch scan <figma-url> --verbose
```

## Configuration

RedSketch needs two API keys:

| Key | Source | Purpose |
|-----|--------|---------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Claude API for AI analysis |
| `FIGMA_ACCESS_TOKEN` | [figma.com/developers](https://www.figma.com/developers/api#access-tokens) | Figma REST API for reading designs |

Set them as environment variables (recommended) or in a `.redsketch.json` config file:

```json
{
  "apiKey": "sk-ant-...",
  "figmaToken": "figd_...",
  "model": "claude-sonnet-4-6"
}
```

## Available Regulations

| ID | Regulation |
|----|-----------|
| `gdpr` | General Data Protection Regulation (EU) |
| `ccpa` | California Consumer Privacy Act (US) |
| `soc2` | Service Organization Control Type 2 |
| `iso27001` | Information Security Management System |
| `pci` | PCI DSS 4.0 |
| `ftc` | FTC Act — Deceptive Practices |
| `euaiact` | EU AI Act — Article 50 Transparency |
| `nis2` | Network and Information Security Directive 2 (EU) |
| `dora` | Digital Operational Resilience Act (EU) |
| `cra` | Cyber Resilience Act (EU) |
| `eaa` | European Accessibility Act |
| `iec62443` | Industrial Control System Security |
| `wcag` | Web Content Accessibility Guidelines 2.2 |
| `fido2` | WebAuthn / FIDO2 |
| `iso42001` | AI Management System |

## How It Works

RedSketch uses a specialized AI agent powered by Claude that:

- Parses your Figma design's node hierarchy, component names, and text content
- Applies the STRIDE threat modeling framework at the UI layer
- Cross-references findings against 34 interactive security UX patterns from [uxsec.dev](https://uxsec.dev)
- Maps gaps to applicable regulations and compliance requirements

The analysis happens before any code exists — catching security issues at the design stage when they're cheapest to fix.

## Pattern Library

RedSketch's knowledge base comes from the [Security UX Pattern Library](https://uxsec.dev) — 34 interactive patterns across 8 categories:

- **Authentication** (8 patterns) — Login, MFA, passwords, sessions, passkeys, OAuth
- **Threat Response** (3 patterns) — Breach notification, phishing, suspicious activity
- **Dark Patterns** (6 patterns) — Confirmshaming, cookie consent, hidden unsubscribe
- **Data Protection** (4 patterns) — Encryption, file upload, deletion, audit logs
- **OWASP Top 10** (3 patterns) — Access control, misconfiguration, logging
- **AI Transparency** (3 patterns) — Disclosure, content labeling, decision explanation
- **Industrial** (4 patterns) — Operator auth, safety-critical, alarms, HMI navigation
- **Governance** (3 patterns) — Design review, change management, compliance audit

## License

MIT — Piia Alavesa
