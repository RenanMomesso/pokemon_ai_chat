import { APIError, NetworkError } from "@/src/utils";
import Anthropic from "@anthropic-ai/sdk";
import { Message, Tool } from "../../types";
import { AI_SERVICE_CONFIG, ERROR_CODES } from "./AIService.config";
import { AIServiceInterface, AnthropicMessage, AnthropicTool } from "./types";

export class AIService implements AIServiceInterface {
  private anthropic: Anthropic;
  private tools: Tool[] = [];

  constructor() {
    const apiKey =
      process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || ""
      

    this.anthropic = new Anthropic({
      apiKey: apiKey,
      defaultHeaders: {
        "anthropic-version": "2023-06-01",
      },
    });
  }
  registerTools(tools: Tool[]): void {
    throw new Error("Method not implemented.");
  }

  registerTool(tool: Tool): void {
    if (!this.tools.find((t) => t.name === tool.name)) {
      this.tools.push(tool);
    }
  }

  private convertMessagesToAnthropic(messages: Message[]): AnthropicMessage[] {
    return messages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
  }

  private convertToolsToAnthropic(): AnthropicTool[] {
    return this.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));
  }

  private handleError(error: any): never {
    console.error("Error in AI service:", error);

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        throw new APIError(
          AI_SERVICE_CONFIG.errorMessages.invalidApiKey,
          ERROR_CODES.UNAUTHORIZED
        );
      }
      if (error.message.includes("429")) {
        throw new APIError(
          AI_SERVICE_CONFIG.errorMessages.rateLimitExceeded,
          ERROR_CODES.RATE_LIMITED
        );
      }
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        throw new NetworkError(AI_SERVICE_CONFIG.errorMessages.networkError);
      }
    }

    throw new APIError(this.handleError(error));
  }

  async *streamResponse(
    messages: Message[],
    onToolCall?: (toolCall: any) => Promise<any>
  ): AsyncGenerator<
    | { type: "text"; content: string }
    | { type: "tool_call"; name: string; args: any },
    void,
    unknown
  > {
    try {
      const anthropicMessages = this.convertMessagesToAnthropic(messages);

      const stream = await this.anthropic.messages.create({
        model: AI_SERVICE_CONFIG.model,
        max_tokens: AI_SERVICE_CONFIG.maxTokens,
        messages: anthropicMessages,
        tools: this.convertToolsToAnthropic(),
        stream: true,
        system: AI_SERVICE_CONFIG.systemPrompt,
      });

      let currentToolCall: any = null;
      let toolCallContent = "";

      for await (const chunk of stream) {
        if (chunk.type === "content_block_start") {
          if (chunk.content_block.type === "tool_use") {
            currentToolCall = {
              id: chunk.content_block.id,
              name: chunk.content_block.name,
              input: {},
            };
          }
        } else if (chunk.type === "content_block_delta") {
          if (chunk.delta.type === "text_delta") {
            yield { type: "text", content: chunk.delta.text };
          } else if (chunk.delta.type === "input_json_delta") {
            toolCallContent += chunk.delta.partial_json;
          }
        } else if (chunk.type === "content_block_stop") {
          if (currentToolCall && toolCallContent) {
            try {
              currentToolCall.input = JSON.parse(toolCallContent);

              // Yield tool call for execution
              yield {
                type: "tool_call",
                name: currentToolCall.name,
                args: currentToolCall.input,
              };
            } catch (error) {
              console.error("Error parsing tool call:", error);
            }

            currentToolCall = null;
            toolCallContent = "";
          }
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      const anthropicMessages = this.convertMessagesToAnthropic(messages);

      const response = await this.anthropic.messages.create({
        model: AI_SERVICE_CONFIG.model,
        max_tokens: AI_SERVICE_CONFIG.maxTokens,
        messages: anthropicMessages,
        tools: this.convertToolsToAnthropic(),
        system: AI_SERVICE_CONFIG.systemPrompt,
      });

      return response.content
        .filter((block) => block.type === "text")
        .map((block) => (block as any).text)
        .join("");
    } catch (error) {
      this.handleError(error);
    }
  }
}
