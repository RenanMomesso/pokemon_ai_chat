import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import { Message } from '../../types';
import { MessageBubble } from '../MessageBubble';
import { styles } from './ChatScreen.styles';
import { ChatScreenHook } from './types';

export const useChatScreen = (): ChatScreenHook => {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearMessages,
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
      <Text style={styles.emptyStateTitle}>Welcome to PokéChat!</Text>
      <Text style={styles.emptyStateSubtitle}>
        I'm your AI-powered Pokédex assistant. Ask me anything about Pokémon!
      </Text>
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Try asking:</Text>
        <Text style={styles.suggestion}>• &ldquo;Tell me about Pikachu&rdquo;</Text>
        <Text style={styles.suggestion}>• &ldquo;Show me fire-type Pokémon&rdquo;</Text>
        <Text style={styles.suggestion}>• &ldquo;Analyze my team: Charizard, Blastoise, Venusaur&rdquo;</Text>
        <Text style={styles.suggestion}>• &ldquo;Give me a random Pokémon&rdquo;</Text>
        <Text style={styles.suggestion}>• &ldquo;What are the moves of Charizard&rdquo;</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Ionicons name="flash" size={24} color="#FFD700" />
        <Text style={styles.headerTitle}>PokéChat</Text>
      </View>
      
      {messages.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearChat}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );

  return {
    messages,
    isLoading,
    error,
    flatListRef,
    sendMessage,
    clearMessages,
    handleClearChat,
    renderMessage,
    renderEmptyState,
    renderHeader,
  };
};