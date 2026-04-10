import Anthropic from "@anthropic-ai/sdk";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { log } from "../utils/logger.js";

export interface LLMResponse<T = string> {
  data: T;
  usage: { input: number; output: number };
}

export interface ChatOptions {
  maxTokens: number;
  temperature: number;
  model?: string;
}

export class LLMClient {
  private client: Anthropic;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel = "claude-sonnet-4-6") {
    this.client = new Anthropic({ apiKey });
    this.defaultModel = defaultModel;
  }

  private static MAX_RETRIES = 5;

  async chatStructured<T>(
    systemPrompt: string,
    userMessage: string,
    schema: z.ZodType<T>,
    options: ChatOptions,
    onToken?: (text: string) => void,
    _retryCount = 0,
  ): Promise<LLMResponse<T>> {
    const model = options.model ?? this.defaultModel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonSchema = zodToJsonSchema(schema as any);

    try {
      const isHaiku = model.includes("haiku");

      const haikuSystemSuffix = isHaiku
        ? `\n\nIMPORTANT: You MUST respond with ONLY valid JSON matching this schema — no markdown, no explanation:\n${JSON.stringify(jsonSchema, null, 2)}`
        : "";

      const stream = this.client.messages.stream({
        model,
        max_tokens: options.maxTokens,
        temperature: isHaiku ? 0.3 : 1,
        ...(isHaiku ? {} : { thinking: { type: "adaptive" as const } }),
        system: [{ type: "text" as const, text: systemPrompt + haikuSystemSuffix, cache_control: { type: "ephemeral" as const } }],
        messages: [{ role: "user", content: userMessage }],
        ...(isHaiku
          ? {}
          : {
              output_config: {
                format: {
                  type: "json_schema" as const,
                  schema: jsonSchema as Record<string, unknown>,
                },
              },
            }),
      });

      for await (const event of stream) {
        if (event.type === "content_block_delta") {
          if (event.delta.type === "thinking_delta" && onToken) {
            onToken(event.delta.thinking);
          } else if (event.delta.type === "text_delta" && onToken) {
            onToken(event.delta.text);
          }
        }
      }

      const finalMessage = await stream.finalMessage();

      let text = finalMessage.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n");

      if (isHaiku) {
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) text = jsonMatch[1].trim();
      }

      const parsed = schema.parse(JSON.parse(text));

      return {
        data: parsed,
        usage: {
          input: finalMessage.usage.input_tokens,
          output: finalMessage.usage.output_tokens,
        },
      };
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) {
        if (_retryCount >= LLMClient.MAX_RETRIES) {
          throw new Error("Rate limited — max retries exceeded.");
        }
        const delay = Math.min(10_000 * 2 ** _retryCount, 60_000) + Math.random() * 1_000;
        log.warn(`Rate limited — waiting ${Math.round(delay / 1000)}s before retry (${_retryCount + 1}/${LLMClient.MAX_RETRIES})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.chatStructured(systemPrompt, userMessage, schema, options, onToken, _retryCount + 1);
      }
      if (error instanceof Anthropic.AuthenticationError) {
        throw new Error("Invalid API key. Check your ANTHROPIC_API_KEY.");
      }
      if (error instanceof Anthropic.APIError) {
        throw new Error(`Claude API error (${error.status}): ${error.message}`);
      }
      throw error;
    }
  }
}
