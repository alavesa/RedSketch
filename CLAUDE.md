# CLAUDE.md — RedSketch

## Project overview

RedSketch is a CLI tool that generates STRIDE-based security threat models from Figma designs. It reads a Figma file via the REST API, identifies security-relevant UI elements, and uses Claude to produce structured threat analysis with pattern matching against 34 Security UX patterns (uxsec.dev) and 19 regulation mappings.

## Commands

```bash
npm run dev          # Run CLI via tsx (development)
npm run build        # Compile TypeScript to dist/
npm test             # Run tests with vitest
```

## Architecture

- `src/agents/base-agent.ts` — Abstract BaseAgent<T> with 3 methods: getSystemPrompt(), buildUserMessage(), getOutputSchema()
- `src/agents/threat-model.ts` — ThreatModelAgent: STRIDE analysis + pattern matching + compliance gaps
- `src/core/llm-client.ts` — Anthropic SDK wrapper with streaming, structured outputs, adaptive thinking, prompt caching
- `src/core/config.ts` — Config resolution: env vars > .redsketch.json > defaults
- `src/figma/url-parser.ts` — Parse Figma URLs to { fileKey, nodeId }
- `src/figma/reader.ts` — Figma REST API client: fetch nodes, flatten tree, extract text/components
- `src/data/security-ux-patterns.ts` — 34 patterns + 19 regulations static knowledge base
- `src/cli/commands/scan.ts` — Main CLI command
- `src/utils/` — Formatter, logger, cost tracker, banner

## Key patterns

- **Structured outputs:** LLM responses validated by Zod schemas via json_schema output config
- **Adaptive thinking:** temperature must be 1 when enabled (Claude API requirement)
- **Prompt caching:** System prompt uses cache_control: { type: "ephemeral" } for ~90% cost savings
- **Pattern knowledge base:** All 34 patterns embedded in system prompt with relevantUISignals for matching

## Environment variables

- `ANTHROPIC_API_KEY` — Claude API key (required)
- `FIGMA_ACCESS_TOKEN` — Figma Personal Access Token (required)
