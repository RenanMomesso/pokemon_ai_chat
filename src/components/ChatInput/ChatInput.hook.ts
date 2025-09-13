import { useState } from 'react';
import { Alert } from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import { ChatInputHook } from './types';

export const useChatInput = (): ChatInputHook => {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading } = useChat();

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    if (!trimmedMessage) {
      Alert.alert('Empty Message', 'Please enter a message before sending.');
      return;
    }
    console.log("tentou")
    try {
      await sendMessage(trimmedMessage);
      console.log("tentou denov")
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const isDisabled = isLoading || !message.trim();

  return {
    message,
    setMessage,
    handleSend,
    isDisabled,
  };
};