import { ReactElement } from "react";
import { Message } from "../../types";

export interface ChatScreenProps {
}


export interface ChatScreenState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatScreenHook {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  flatListRef: React.RefObject<any>;
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  handleClearChat: () => void;
  renderMessage: ({ item }: { item: Message }) => ReactElement;
  renderEmptyState: () => ReactElement;
  renderHeader: () => ReactElement;
}