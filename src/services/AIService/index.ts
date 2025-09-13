export { AIService } from './AIService';
export { AI_SERVICE_CONFIG, ERROR_CODES } from './AIService.config';
export type {
  AIServiceConfig,
  StreamResponseOptions,
  ToolCall,
  AIServiceInterface,
  AnthropicMessage,
  AnthropicTool,
} from './types';

// Export a singleton instance
import { AIService } from './AIService';
export const aiService = new AIService();