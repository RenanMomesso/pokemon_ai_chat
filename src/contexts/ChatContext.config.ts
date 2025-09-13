import { ChatConfig } from './types';

export const CHAT_CONFIG: ChatConfig = {
  storageKey: 'chatMessages',
  maxMessages: 1000,
  enablePersistence: true,
  streamingDelay: 50
};

export const CHAT_ERRORS = {
  SEND_MESSAGE_FAILED: 'Failed to send message. Please try again.',
  LOAD_MESSAGES_FAILED: 'Failed to load chat history.',
  SAVE_MESSAGES_FAILED: 'Failed to save chat history.',
  CLEAR_MESSAGES_FAILED: 'Failed to clear chat history.',
  TOOL_EXECUTION_FAILED: (toolName: string) => `Failed to execute tool: ${toolName}`,
  STREAMING_FAILED: 'Failed to stream response from AI.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
};

export const CHAT_MESSAGES = {
  MESSAGES_CLEARED: 'Chat history cleared successfully.',
  MESSAGES_LOADED: 'Chat history loaded successfully.',
  TOOL_EXECUTED: (toolName: string) => `Tool ${toolName} executed successfully.`
};

export const CHAT_CONSTANTS = {
  USER_SENDER: 'user' as const,
  AI_SENDER: 'assistant' as const,
  STREAMING_INDICATOR: '...',
  TOOL_CALL_PREFIX: '[Tool Call]',
  ERROR_PREFIX: '[Error]'
};

export const STORAGE_KEYS = {
  MESSAGES: CHAT_CONFIG.storageKey,
  USER_PREFERENCES: 'userPreferences',
  CHAT_SETTINGS: 'chatSettings'
};

export const TIMING = {
  STREAMING_DELAY: CHAT_CONFIG.streamingDelay,
  DEBOUNCE_DELAY: 300,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3
};