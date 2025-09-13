import { ReactNode } from 'react';
import { Tool } from '../types';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  result?: string;
  error?: string;
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'SET_STREAMING'; payload: { id: string; isStreaming: boolean } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export interface ChatProviderProps {
  children: ReactNode;
}

export interface StorageService {
  saveMessages: (messages: Message[]) => Promise<void>;
  loadMessages: () => Promise<Message[]>;
  clearMessages: () => Promise<void>;
}

export interface ChatConfig {
  storageKey: string;
  maxMessages: number;
  enablePersistence: boolean;
  streamingDelay: number;
}

export interface ChatError {
  type: 'NETWORK_ERROR' | 'TOOL_ERROR' | 'STORAGE_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: any;
}

export interface ToolExecutionContext {
  messageId: string;
  toolCall: ToolCall;
  availableTools: Tool[];
}

export interface StreamingOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}