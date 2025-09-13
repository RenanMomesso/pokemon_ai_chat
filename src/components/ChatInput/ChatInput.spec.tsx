import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ChatInput } from './ChatInput';
import { useChat } from '../../contexts/ChatContext';

jest.mock('../../contexts/ChatContext', () => ({
  useChat: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

const mockUseChat = useChat as jest.MockedFunction<typeof useChat>;

describe('ChatInput', () => {
  const mockSendMessage = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseChat.mockReturnValue({
      sendMessage: mockSendMessage,
      isLoading: false,
      messages: [],
      error: null,
      clearMessages: jest.fn(),
      loadMessages: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByTestId } = render(<ChatInput />);
    
    expect(getByPlaceholderText('Ask me about Pokémon...')).toBeTruthy();
    expect(getByTestId('send-button')).toBeTruthy();
  });

  it('updates message state when typing', () => {
    const { getByPlaceholderText } = render(<ChatInput />);
    const textInput = getByPlaceholderText('Ask me about Pokémon...');
    
    fireEvent.changeText(textInput, 'Hello Pikachu');
    expect(textInput.props.value).toBe('Hello Pikachu');
  });

  it('sends message when send button is pressed', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChatInput />);
    const textInput = getByPlaceholderText('Ask me about Pokémon...');
    const sendButton = getByTestId('send-button');
    
    fireEvent.changeText(textInput, 'Tell me about Pikachu');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Tell me about Pikachu');
    });
  });

  it('does not send empty message', () => {
    const { getByTestId } = render(<ChatInput />);
    const sendButton = getByTestId('send-button');
    
    fireEvent.press(sendButton);
    
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('disables input when loading', () => {
    mockUseChat.mockReturnValue({
      sendMessage: mockSendMessage,
      isLoading: true,
      messages: [],
      error: null,
      clearMessages: jest.fn(),
      loadMessages: jest.fn(),
    });

    const { getByPlaceholderText, getByTestId } = render(<ChatInput />);
    const textInput = getByPlaceholderText('Ask me about Pokémon...');
    const sendButton = getByTestId('send-button');
    
    expect(textInput.props.editable).toBe(false);
    expect(sendButton.props.accessibilityState.disabled).toBe(true);
  });

  it('shows error alert when send fails', async () => {
    mockSendMessage.mockRejectedValueOnce(new Error('Network error'));
    
    const { getByPlaceholderText, getByTestId } = render(<ChatInput />);
    const textInput = getByPlaceholderText('Ask me about Pokémon...');
    const sendButton = getByTestId('send-button');
    
    fireEvent.changeText(textInput, 'Test message');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Failed to send message. Please try again.'
      );
    });
  });

  it('clears message after successful send', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChatInput />);
    const textInput = getByPlaceholderText('Ask me about Pokémon...');
    const sendButton = getByTestId('send-button');
    
    fireEvent.changeText(textInput, 'Test message');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(textInput.props.value).toBe('');
    });
  });
});