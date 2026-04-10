import type { z } from "zod";
import type { LLMClient } from "../core/llm-client.js";
import type { AgentContext, AgentResult } from "../types/index.js";

export abstract class BaseAgent<T = unknown> {
  abstract readonly name: string;
  abstract readonly description: string;

  constructor(protected llmClient: LLMClient) {}

  protected abstract getSystemPrompt(): string;
  protected abstract buildUserMessage(context: AgentContext): string;
  protected abstract getOutputSchema(): z.ZodType<T>;

  async execute(
    context: AgentContext,
    onToken?: (text: string) => void,
  ): Promise<AgentResult> {
    const systemPrompt = this.getSystemPrompt();
    const userMessage = this.buildUserMessage(context);
    const schema = this.getOutputSchema();

    const response = await this.llmClient.chatStructured(
      systemPrompt,
      userMessage,
      schema,
      {
        maxTokens: context.config.maxTokens,
        temperature: context.config.temperature,
        model: context.config.model,
      },
      onToken,
    );

    return {
      agentName: this.name,
      success: true,
      data: response.data,
      rawResponse: JSON.stringify(response.data),
      tokensUsed: response.usage,
    };
  }
}
