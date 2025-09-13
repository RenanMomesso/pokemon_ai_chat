import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../ChatInput';
import { useChatScreen } from './ChatScreen.hooks';
import { styles } from './ChatScreen.styles';
import { ChatScreenProps } from './types';

const ChatScreen = (props: ChatScreenProps)  => {
  const {
    messages,
    isLoading,
    error,
    flatListRef,
    sendMessage,
    renderMessage,
    renderEmptyState,
    renderHeader,
  } = useChatScreen();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {renderHeader()}
        
        <View style={styles.chatContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={[
              styles.messagesContainer,
              messages.length === 0 && styles.emptyContainer,
            ]}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: false });
              }
            }}
          />
          
          <ChatInput />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatScreen