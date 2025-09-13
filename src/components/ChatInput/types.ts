export interface ChatInputProps {
  // Props interface for ChatInput component
}

export interface ChatInputState {
  message: string;
}

export interface ChatInputHook {
  message: string;
  setMessage: (message: string) => void;
  handleSend: () => Promise<void>;
  isDisabled: boolean;
}