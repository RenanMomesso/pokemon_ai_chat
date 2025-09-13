import { render } from '@testing-library/react-native';
import React from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      spring: jest.fn(() => ({
        start: jest.fn(),
      })),
      parallel: jest.fn(() => ({
        start: jest.fn(),
      })),
      sequence: jest.fn(() => ({
        start: jest.fn(),
      })),
      loop: jest.fn(() => ({
        start: jest.fn(),
      })),
    },
  };
});

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
  it('renders user message correctly', () => {
    const { getByText } = render(<MessageBubble message={mockUserMessage} />);
    
    expect(getByText('Hello, this is a user message')).toBeTruthy();
    expect(getByText('12:00 PM')).toBeTruthy();
  });

  it('renders assistant message correctly', () => {
    const { getByText } = render(<MessageBubble message={mockAssistantMessage} />);
    
    expect(getByText('Hello, this is an assistant message')).toBeTruthy();
    expect(getByText('12:01 PM')).toBeTruthy();
  });

  it('shows streaming indicator for streaming messages', () => {
    const { getByText, getByTestId } = render(<MessageBubble message={mockStreamingMessage} />);
    
    expect(getByText('This message is streaming...')).toBeTruthy();
    // The streaming dots should be rendered
    expect(() => getByTestId('streaming-dots')).not.toThrow();
  });

  it('formats timestamp correctly', () => {
    const { getByText } = render(<MessageBubble message={mockUserMessage} />);
    
    // Should format time as HH:MM AM/PM
    expect(getByText('12:00 PM')).toBeTruthy();
  });

  it('applies correct styles for user messages', () => {
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