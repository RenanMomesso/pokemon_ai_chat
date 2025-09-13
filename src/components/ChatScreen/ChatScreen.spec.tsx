import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatScreen from './ChatScreen';
import { useChat } from '../../contexts/ChatContext';

// Mock the useChat hook
jest.mock('../../contexts/ChatContext', () => ({
  useChat: jest.fn(),
}));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock MessageBubble and ChatInput components
jest.mock('../MessageBubble', () => ({
  MessageBubble: ({ message }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, {}, `MessageBubble-${message.id}`);
  },
}));

jest.mock('../ChatInput', () => ({
  ChatInput: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, {}, 'ChatInput');
  },
}));

const mockUseChat = useChat as jest.MockedFunction<typeof useChat>;

describe('ChatScreen', () => {
  let queryClient: QueryClient;
  const mockLoadMessages = jest.fn();
  const mockClearMessages = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });
  
  const mockMessages = [
    {
      id: '1',
      content: 'Hello',
      role: 'user' as const,
      timestamp: new Date(),
    },
    {
      id: '2',
      content: 'Hi there!',
      role: 'assistant' as const,
      timestamp: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseChat.mockReturnValue({
      messages: [],
      isLoading: false,
      error: null,
      sendMessage: jest.fn(),
      clearMessages: mockClearMessages,
    });
  });

  it('renders correctly with empty state', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <ChatScreen />
      </QueryClientProvider>
    );
    
    expect(getByText('PokéChat')).toBeTruthy();
    expect(getByText('Welcome to PokéChat!')).toBeTruthy();
    expect(getByText('I\'m your AI-powered Pokédex assistant. Ask me anything about Pokémon!')).toBeTruthy();
  });

  it('renders messages when available', () => {
    mockUseChat.mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      error: null,
      sendMessage: jest.fn(),
      clearMessages: mockClearMessages,
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <ChatScreen />
      </QueryClientProvider>
    );
    
    expect(getByText('MessageBubble-1')).toBeTruthy();
    expect(getByText('MessageBubble-2')).toBeTruthy();
  });

  it('shows clear button when messages exist', () => {
    mockUseChat.mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      error: null,
      sendMessage: jest.fn(),
      clearMessages: mockClearMessages,
    });

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ChatScreen />
      </QueryClientProvider>
    );
    
    const clearButton = getByTestId('clear-button');
    expect(clearButton).toBeTruthy();
  });

  it('shows error message when error exists', () => {
    mockUseChat.mockReturnValue({
      messages: [],
      isLoading: false,
      error: 'Network error occurred',
      sendMessage: jest.fn(),
      clearMessages: mockClearMessages,
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <ChatScreen />
      </QueryClientProvider>
    );
    
    expect(getByText('Network error occurred')).toBeTruthy();
  });



  it('shows clear confirmation dialog when clear button is pressed', () => {
    mockUseChat.mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      error: null,
      sendMessage: jest.fn(),
      clearMessages: mockClearMessages,
    });

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ChatScreen />
      </QueryClientProvider>
    );
    
    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
        expect.objectContaining({ text: 'Clear', style: 'destructive' }),
      ])
    );
  });

  it('displays suggestions in empty state', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <ChatScreen />
      </QueryClientProvider>
    );
    
    expect(getByText('Try asking:')).toBeTruthy();
    expect(getByText('• "Tell me about Pikachu"')).toBeTruthy();
    expect(getByText('• 
  });

  it('renders ChatInput component', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <ChatScreen />
      </QueryClientProvider>
    );
    
    expect(getByText('ChatInput')).toBeTruthy();
  });
});