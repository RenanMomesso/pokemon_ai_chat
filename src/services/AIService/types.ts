import { Message, Tool } from '../../types';

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

export interface StreamResponseOptions {
  messages: Message[];
  onToolCall?: (toolCall: ToolCall) => Promise<any>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: any;
  arguments?: any;
}

export interface AIServiceInterface {
  registerTool(tool: Tool): void;
  registerTools(tools: Tool[]): void;
  streamResponse(
    messages: Message[],
    onToolCall?: (toolCall: any) => Promise<any>
  ): AsyncGenerator<{type: 'text', content: string} | {type: 'tool_call', name: string, args: any}, void, unknown>;
  generateResponse(messages: Message[]): Promise<string>;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AITool {
  name: string;
  description: string;
  input_schema: any;
}