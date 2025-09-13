import React from 'react';
import { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { MessageBubbleHook, MessageBubbleProps } from './types';

export const useMessageBubble = ({ message }: MessageBubbleProps): MessageBubbleHook => {
  const isUser = message.role === 'user';
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    isUser,
    animatedStyle,
    formatTime,
  };
};

export const useStreamingDots = () => {
  const dot1Opacity = useSharedValue(0);
  const dot2Opacity = useSharedValue(0);
  const dot3Opacity = useSharedValue(0);

  React.useEffect(() => {
    const animateDots = () => {
      dot1Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      );
      
      setTimeout(() => {
        dot2Opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0, { duration: 300 })
          ),
          -1,
          false
        );
      }, 100);
      
      setTimeout(() => {
        dot3Opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0, { duration: 300 })
          ),
          -1,
          false
        );
      }, 200);
    };

    animateDots();
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  return {
    dot1Style,
    dot2Style,
    dot3Style,
  };
};