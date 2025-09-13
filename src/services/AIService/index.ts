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

import { AIService } from './AIService';
const getApiKey = () => {
  if (process.env.NODE_ENV === 'test') {
    return 'test-api-key';
  }
  return undefined;
};
export const aiService = new AIService(getApiKey());