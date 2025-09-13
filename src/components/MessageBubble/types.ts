import { ViewStyle } from 'react-native';
import { AnimatedStyle } from 'react-native-reanimated';
import { Message } from '../../types';

export interface MessageBubbleProps {
  message: Message;
}

export interface MessageBubbleHook {
  isUser: boolean;
  animatedStyle: AnimatedStyle<ViewStyle>;
  formatTime: (date: Date) => string;
}
