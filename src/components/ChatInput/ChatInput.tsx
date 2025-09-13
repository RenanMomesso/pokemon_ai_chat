import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import { useChatInput } from './ChatInput.hook';
import { styles } from './ChatInput.styles';
import { ChatInputProps } from './types';

export function ChatInput(props: ChatInputProps) {
  const { message, setMessage, handleSend, isDisabled } = useChatInput();
  const { isLoading } = useChat();

  return (
    <View style={[styles.container]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask me about Pokémon..."
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          editable={!isLoading}
          blurOnSubmit={false}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            isDisabled && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={isDisabled}
          activeOpacity={0.7}
          testID="send-button"
        >
          <Ionicons
            name={isLoading ? 'hourglass' : 'send'}
            size={20}
            color={isDisabled ? '#999' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}