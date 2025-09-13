export interface ChatInputProps {
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