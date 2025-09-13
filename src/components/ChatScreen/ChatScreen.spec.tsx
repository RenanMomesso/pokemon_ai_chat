import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ChatScreen } from './ChatScreen';
import { useChat } from '../../contexts/ChatContext';

// Mock the useChat hook
jest.mock('../../contexts/ChatContext/ChatContext', () => ({
  useChat: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock MessageBubble and ChatInput components
jest.mock('../MessageBubble', () => ({
  MessageBubble: ({ message }: any) => `MessageBubble-${message.id}`,
}));

jest.mock('../ChatInput', () => ({
  ChatInput: () => 'ChatInput',
}));

const mockUseChat = useChat as jest.MockedFunction<typeof useChat>;

describe('ChatScreen', () => {
  const mockLoadMessages = jest.fn();
  const mockClearMessages = jest.fn();
  
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
      state: {
        messages: [],
        isLoading: false,
        error: null,
      },
      loadMessages: mockLoadMessages,
      clearMessages: mockClearMessages,
      sendMessage: jest.fn(),
    });
  });

  it('renders correctly with empty state', () => {
    const { getByText } = render(<ChatScreen />);
    
    expect(getByText('PokéChat')).toBeTruthy();
    expect(getByText('Welcome to PokéChat!')).toBeTruthy();
    expect(getByText('I\'m your AI-powered Pokédex assistant. Ask me anything about Pokémon!')).toBeTruthy();
  });

  it('renders messages when available', () => {
    mockUseChat.mockReturnValue({
      state: {
        messages: mockMessages,
        isLoading: false,
        error: null,
      },
      loadMessages: mockLoadMessages,
      clearMessages: mockClearMessages,
      sendMessage: jest.fn(),
    });

    const { getByText } = render(<ChatScreen />);
    
    expect(getByText('MessageBubble-1')).toBeTruthy();
    expect(getByText('MessageBubble-2')).toBeTruthy();
  });

  it('shows clear button when messages exist', () => {
    mockUseChat.mockReturnValue({
      state: {
        messages: mockMessages,
        isLoading: false,
        error: null,
      },
      loadMessages: mockLoadMessages,
      clearMessages: mockClearMessages,
      sendMessage: jest.fn(),
    });

    const { getByRole } = render(<ChatScreen />);
    
    const clearButton = getByRole('button');
    expect(clearButton).toBeTruthy();
  });

  it('shows error message when error exists', () => {
    mockUseChat.mockReturnValue({
      state: {
        messages: [],
        isLoading: false,
        error: 'Network error occurred',
      },
      loadMessages: mockLoadMessages,
      clearMessages: mockClearMessages,
      sendMessage: jest.fn(),
    });

    const { getByText } = render(<ChatScreen />);
    
    expect(getByText('Network error occurred')).toBeTruthy();
  });

  it('calls loadMessages on mount', () => {
    render(<ChatScreen />);
    
    expect(mockLoadMessages).toHaveBeenCalled();
  });

  it('shows clear confirmation dialog when clear button is pressed', () => {
    mockUseChat.mockReturnValue({
      state: {
        messages: mockMessages,
        isLoading: false,
        error: null,
      },
      loadMessages: mockLoadMessages,
      clearMessages: mockClearMessages,
      sendMessage: jest.fn(),
    });

    const { getByRole } = render(<ChatScreen />);
    
    const clearButton = getByRole('button');
    fireEvent.press(clearButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Clear Chat',
      'Are you sure you want to clear all messages? This action cannot be undone.',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
        expect.objectContaining({ text: 'Clear', style: 'destructive' }),
      ])
    );
  });

  it('displays suggestions in empty state', () => {
    const { getByText } = render(<ChatScreen />);
    
    expect(getByText('Try asking:')).toBeTruthy();
    expect(getByText('• "Tell me about Pikachu"')).toBeTruthy();
    expect(getByText('• "Show me fire-type Pokémon"')).toBeTruthy();
    expect(getByText('• "Analyze my team: Charizard, Blastoise, Venusaur"')).toBeTruthy();
    expect(getByText('• "Give me a random Pokémon"')).toBeTruthy();
  });

  it('renders ChatInput component', () => {
    const { getByText } = render(<ChatScreen />);
    
    expect(getByText('ChatInput')).toBeTruthy();
  });
});