import { render } from '@testing-library/react-native';
import React from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  
  return {
    __esModule: true,
    default: {
      View: View,
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    withRepeat: jest.fn((value) => value),
    withSequence: jest.fn((value) => value),
  };
});

// Mock the hooks to return simple objects
jest.mock('./MessageBubble.hook', () => ({
  useMessageBubble: jest.fn(() => ({
    isUser: false,
    animatedStyle: {},
    formatTime: jest.fn((date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
  })),
  useStreamingDots: jest.fn(() => ({
    dot1Style: {},
    dot2Style: {},
    dot3Style: {},
  })),
}));

const mockUserMessage: Message = {
  id: '1',
  content: 'Hello, this is a user message',
  role: 'user',
  timestamp: new Date('2023-01-01T12:00:00Z'),
  isStreaming: false,
};

const mockAssistantMessage: Message = {
  id: '2',
  content: 'Hello, this is an assistant message',
  role: 'assistant',
  timestamp: new Date('2023-01-01T12:01:00Z'),
  isStreaming: false,
};

const mockStreamingMessage: Message = {
  id: '3',
  content: 'This message is streaming...',
  role: 'assistant',
  timestamp: new Date('2023-01-01T12:02:00Z'),
  isStreaming: true,
};

describe('MessageBubble', () => {
  const { useMessageBubble, useStreamingDots } = require('./MessageBubble.hook');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user message correctly', () => {
    useMessageBubble.mockReturnValue({
      isUser: true,
      animatedStyle: {},
      formatTime: jest.fn(() => '12:00 PM'),
    });
    
    const { getByText } = render(<MessageBubble message={mockUserMessage} />);
    
    expect(getByText('Hello, this is a user message')).toBeTruthy();
    expect(getByText('12:00 PM')).toBeTruthy();
  });

  it('renders assistant message correctly', () => {
    useMessageBubble.mockReturnValue({
      isUser: false,
      animatedStyle: {},
      formatTime: jest.fn(() => '12:01 PM'),
    });
    
    const { getByText } = render(<MessageBubble message={mockAssistantMessage} />);
    
    expect(getByText('Hello, this is an assistant message')).toBeTruthy();
    expect(getByText('12:01 PM')).toBeTruthy();
  });

  it('shows streaming indicator for streaming messages', () => {
    useMessageBubble.mockReturnValue({
      isUser: false,
      animatedStyle: {},
      formatTime: jest.fn(() => '12:02 PM'),
    });
    
    const { getByText } = render(<MessageBubble message={mockStreamingMessage} />);
    
    expect(getByText('This message is streaming...')).toBeTruthy();
    expect(getByText('12:02 PM')).toBeTruthy();
  });

  it('formats timestamp correctly', () => {
    useMessageBubble.mockReturnValue({
      isUser: true,
      animatedStyle: {},
      formatTime: jest.fn(() => '12:00 PM'),
    });
    
    const { getByText } = render(<MessageBubble message={mockUserMessage} />);
    
    // Should format time as HH:MM AM/PM
    expect(getByText('12:00 PM')).toBeTruthy();
  });

  it('applies correct styles for user messages', () => {
    useMessageBubble.mockReturnValue({
      isUser: true,
      animatedStyle: {},
      formatTime: jest.fn(() => '12:00 PM'),
    });
    
    const { getByText } = render(<MessageBubble message={mockUserMessage} />);
    const messageText = getByText('Hello, this is a user message');
    
    // User messages should have white text
    expect(messageText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#FFFFFF' })
      ])
    );
  });

  it('applies correct styles for assistant messages', () => {
    useMessageBubble.mockReturnValue({
      isUser: false,
      animatedStyle: {},
      formatTime: jest.fn(() => '12:01 PM'),
    });
    
    const { getByText } = render(<MessageBubble message={mockAssistantMessage} />);
    const messageText = getByText('Hello, this is an assistant message');
    
    // Assistant messages should have black text
    expect(messageText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#000000' })
      ])
    );
  });
});