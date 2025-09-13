import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { aiService } from '../services/AIService';
import { pokemonTools } from '../tools';
import { prefetchPokemonFromMessage } from '../utils/pokemonPrefetch';
import {
  CHAT_CONFIG,
  CHAT_CONSTANTS,
  CHAT_ERRORS,
  STORAGE_KEYS
} from './ChatContext.config';
import {
  ChatAction,
  ChatContextType,
  ChatProviderProps,
  ChatState,
  Message,
  ToolCall
} from './types';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        )
      };
    
    case 'SET_STREAMING':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, isStreaming: action.payload.isStreaming }
            : msg
        )
      };
    
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        error: null
      };
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const queryClient = useQueryClient();

  useEffect(() => {
    pokemonTools.forEach(tool => {
      aiService.registerTool(tool);
    });
  }, []);

  const saveMessages = useCallback(async (messages: Message[]) => {
    if (!CHAT_CONFIG.enablePersistence) return;
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      queryClient.setQueryData(['chat', 'messages'], messages);
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, [queryClient]);

  const loadMessages = useCallback(async () => {
    if (!CHAT_CONFIG.enablePersistence) return;
    
    try {
      const cachedMessages = queryClient.getQueryData<Message[]>(['chat', 'messages']);
      if (cachedMessages) {
        dispatch({ type: 'SET_MESSAGES', payload: cachedMessages });
        return;
      }
      
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (stored) {
        const messages: Message[] = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        dispatch({ type: 'SET_MESSAGES', payload: messages });
        queryClient.setQueryData(['chat', 'messages'], messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      dispatch({ type: 'SET_ERROR', payload: CHAT_ERRORS.LOAD_MESSAGES_FAILED });
    }
  }, [queryClient]);

  const clearMessages = useCallback(async () => {
    try {
      dispatch({ type: 'CLEAR_MESSAGES' });
      if (CHAT_CONFIG.enablePersistence) {
        await AsyncStorage.removeItem(STORAGE_KEYS.MESSAGES);
        queryClient.removeQueries({ queryKey: ['chat', 'messages'] });
      }
    } catch (error) {
      console.error('Failed to clear messages:', error);
      dispatch({ type: 'SET_ERROR', payload: CHAT_ERRORS.CLEAR_MESSAGES_FAILED });
    }
  }, [queryClient]);

  const executeToolCall = useCallback(async (toolCall: ToolCall): Promise<string> => {
    try {
      const tool = pokemonTools.find(t => t.name === toolCall.name);
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`);
      }
      
      const result = await tool.execute(toolCall.args);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`${CHAT_ERRORS.TOOL_EXECUTION_FAILED(toolCall.name)}: ${errorMessage}`);
    }
  }, []);

  const randomId = () => new Date().getTime().toString()
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    console.log("send message")
    const userMessage: Message = {
      id: randomId(),
      content: content.trim(),
      role: CHAT_CONSTANTS.USER_SENDER,
      timestamp: new Date()
    };
    console.log("🚀 ~ ChatProvider ~ userMessage:", userMessage)

    const aiMessage: Message = {
      id: randomId(),
      content: '',
      role: CHAT_CONSTANTS.AI_SENDER,
      timestamp: new Date(),
      isStreaming: true
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await prefetchPokemonFromMessage(queryClient, content.trim());
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
    
    dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

    try {
      const messages = [...state.messages, userMessage];
      let fullResponse = '';
      let currentToolCalls: ToolCall[] = [];

      for await (const chunk of aiService.streamResponse(messages)) {
        if (chunk.type === 'text') {
          fullResponse += chunk.content;
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
              id: aiMessage.id,
              updates: { content: fullResponse }
            }
          });
        } else if (chunk.type === 'tool_call') {
          const toolCall: ToolCall = {
            id: randomId(),
            name: chunk.name,
            args: chunk.args
          };

          currentToolCalls.push(toolCall);

          try {
            const result = await executeToolCall(toolCall);
            toolCall.result = result;
            fullResponse += `\n\n${result}`;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toolCall.error = errorMessage;
            fullResponse += `\n\n${CHAT_CONSTANTS.ERROR_PREFIX} ${errorMessage}`;
          }

          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
              id: aiMessage.id,
              updates: {
                content: fullResponse,
                toolCalls: [...currentToolCalls]
              }
            }
          });
        }
      }

      dispatch({
        type: 'SET_STREAMING',
        payload: { id: aiMessage.id, isStreaming: false }
      });

      const updatedMessages = [...messages, { ...aiMessage, content: fullResponse, isStreaming: false, toolCalls: currentToolCalls }];
      await saveMessages(updatedMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : CHAT_ERRORS.UNKNOWN_ERROR;
      
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: aiMessage.id,
          updates: {
            content: `${CHAT_CONSTANTS.ERROR_PREFIX} ${errorMessage}`,
            isStreaming: false
          }
        }
      });
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.messages, saveMessages, executeToolCall]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (state.messages.length > 0) {
      saveMessages(state.messages);
    }
  }, [state.messages, saveMessages]);

  const contextValue: ChatContextType = {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}