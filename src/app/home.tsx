import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatScreen } from '../components/ChatScreen';
import { useChat } from '../contexts';

export default function HomePage() {
  const { messages, isLoading, error } = useChat();

  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});