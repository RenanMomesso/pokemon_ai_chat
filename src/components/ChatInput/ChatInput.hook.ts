import { fetch as expoFetch } from 'expo/fetch';
import { useState } from "react";
import { Alert } from "react-native";
import { useChat } from "../../contexts/ChatContext";
import { ChatInputHook } from "./types";

export const useChatInput = (): ChatInputHook => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { sendMessage, isLoading } = useChat();

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) {
      if (!trimmedMessage) {
        Alert.alert("Empty Message", "Please enter a message before sending.");
      }
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(trimmedMessage);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const isDisabled = isLoading || isSending || !message.trim();

  return {
    message,
    setMessage,
    handleSend,
    isDisabled,
  };
};
