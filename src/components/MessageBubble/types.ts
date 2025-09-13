import { Message } from '../../types';

export interface MessageBubbleProps {
  message: Message;
}

export interface MessageBubbleHook {
  isUser: boolean;
  fadeAnim: any;
  scaleAnim: any;
  formatTime: (date: Date) => string;
}

export interface StreamingDotsHook {
  dot1: any;
  dot2: any;
  dot3: any;
}