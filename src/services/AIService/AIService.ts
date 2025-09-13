import { APIError, NetworkError } from '../../utils';
import { fetch as expoFetch } from 'expo/fetch';
import { Message, Tool } from '../../types';
import { AI_SERVICE_CONFIG, ERROR_CODES } from './AIService.config';
import { AIMessage, AIServiceInterface, AITool } from './types';

export class AIService implements AIServiceInterface {
  private tools: Tool[] = [];
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    console.log("🚀 ~ AIService ~ constructor ~ apiKey:", key)
    
    if (!key || key === 'your_anthropic_api_key_here') {
      throw new Error('API key is not configured. Please set EXPO_PUBLIC_ANTHROPIC_API_KEY in your environment variables.');
    }

    this.apiKey = key;
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
  }

  registerTool(tool: Tool): void {
    if (!this.tools.find((t) => t.name === tool.name)) {
      this.tools.push(tool);
    }
  }

  registerTools(tools: Tool[]): void {
    tools.forEach(tool => this.registerTool(tool));
  }

  private convertMessagesToAPI(messages: Message[]): AIMessage[] {
    return messages
      .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));
  }

  private convertToolsToAPI(): AITool[] {
    return this.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));
  }

  private handleError(error: any): never {
    console.error('Error in AI service:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new APIError(AI_SERVICE_CONFIG.errorMessages.invalidApiKey, ERROR_CODES.UNAUTHORIZED);
      }
      if (error.message.includes('429')) {
        throw new APIError(AI_SERVICE_CONFIG.errorMessages.rateLimitExceeded, ERROR_CODES.RATE_LIMITED);
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new NetworkError(AI_SERVICE_CONFIG.errorMessages.networkError);
      }
    }
    
    throw new APIError('An unexpected error occurred');
  }

  async *streamResponse(
    messages: Message[],
    onToolCall?: (toolCall: any) => Promise<any>
  ): AsyncGenerator<{type: 'text', content: string} | {type: 'tool_call', name: string, args: any}, void, unknown> {
    try {
      const apiMessages = this.convertMessagesToAPI(messages);
      const tools = this.convertToolsToAPI();

      const requestBody = {
        model: AI_SERVICE_CONFIG.model,
        max_tokens: AI_SERVICE_CONFIG.maxTokens,
        messages: apiMessages,
        tools: tools.length > 0 ? tools : undefined,
        stream: true,
        system: AI_SERVICE_CONFIG.systemPrompt
      };

      const response = await expoFetch(this.baseUrl, {
         method: 'POST',
         headers: {
           'x-api-key': this.apiKey,
           'anthropic-version': '2023-06-01',
           'Content-Type': 'application/json',
           'Accept': 'text/event-stream'
         },
         body: JSON.stringify(requestBody)
       });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      console.log('🚀 ~ streamResponse ~ decoder:', decoder);
      
      let buffer = '';
      let currentToolCall: any = null;
      let toolCallContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        console.log(chunkText);
        
        buffer += chunkText;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const chunk = JSON.parse(data);
              
              if (chunk.type === 'content_block_start') {
                if (chunk.content_block?.type === 'tool_use') {
                  currentToolCall = {
                    id: chunk.content_block.id,
                    name: chunk.content_block.name,
                    input: {}
                  };
                }
              } else if (chunk.type === 'content_block_delta') {
                if (chunk.delta?.type === 'text_delta') {
                  yield { type: 'text', content: chunk.delta.text };
                } else if (chunk.delta?.type === 'input_json_delta') {
                  toolCallContent += chunk.delta.partial_json;
                }
              } else if (chunk.type === 'content_block_stop') {
                if (currentToolCall && toolCallContent) {
                  try {
                    currentToolCall.input = JSON.parse(toolCallContent);
                    
                    yield {
                      type: 'tool_call',
                      name: currentToolCall.name,
                      args: currentToolCall.input
                    };
                    
                  } catch (error) {
                    console.error('Error parsing tool call:', error);
                  }
                  
                  currentToolCall = null;
                  toolCallContent = '';
                }
              }
            } catch (error) {
              console.error('Error parsing chunk:', error);
            }
          }
        }
      }
      
      console.log('Streaming complete');
      } catch (error) {
        this.handleError(error);
      }
  }

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      const apiMessages = this.convertMessagesToAPI(messages);
      const tools = this.convertToolsToAPI();

      const requestBody = {
        model: AI_SERVICE_CONFIG.model,
        max_tokens: AI_SERVICE_CONFIG.maxTokens,
        messages: apiMessages,
        tools: tools.length > 0 ? tools : undefined,
        system: AI_SERVICE_CONFIG.systemPrompt
      };

      const response = await expoFetch(this.baseUrl, {
         method: 'POST',
         headers: {
           'x-api-key': this.apiKey,
           'anthropic-version': '2023-06-01',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(requestBody)
       });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.content
        ?.filter((block: any) => block.type === 'text')
        ?.map((block: any) => block.text)
        ?.join('') || '';
    } catch (error) {
      this.handleError(error);
    }
  }
}
