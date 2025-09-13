import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useMessageBubble, useStreamingDots } from './MessageBubble.hook';
import { styles } from './MessageBubble.styles';
import { MessageBubbleProps } from './types';

function StreamingDots() {
  const { dot1Style, dot2Style, dot3Style } = useStreamingDots();

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { isUser, animatedStyle, formatTime } = useMessageBubble({ message });

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        animatedStyle,
      ]}
    >
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.assistantText,
        ]}>
          {message.content}
        </Text>
        
        {message.isStreaming && (
          <View style={styles.streamingIndicator}>
            <StreamingDots />
          </View>
        )}
        
        <Text style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.assistantTimestamp,
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
}