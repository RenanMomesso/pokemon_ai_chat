import React from 'react';
import { Animated, Text, View } from 'react-native';
import { useMessageBubble, useStreamingDots } from './MessageBubble.hook';
import { styles } from './MessageBubble.styles';
import { MessageBubbleProps } from './types';

function StreamingDots() {
  const { dot1, dot2, dot3 } = useStreamingDots();

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { isUser, fadeAnim, scaleAnim, formatTime } = useMessageBubble({ message });

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
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