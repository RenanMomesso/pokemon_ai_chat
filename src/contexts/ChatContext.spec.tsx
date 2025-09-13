import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatProvider, useChat } from './ChatContext';

// Mock the Pokemon hooks
jest.mock('../hooks/usePokemonQueries', () => ({
  usePrefetchPokemon: () => jest.fn(),
}));

// Mock the Pokemon tools
jest.mock('../tools', () => ({
  pokemonTools: [],
}));

// Mock the Pokemon prefetch utility
jest.mock('../utils/pokemonPrefetch', () => ({
  prefetchPokemonFromMessage: jest.fn(),
}));

// Test component that uses the ChatContext
const TestComponent = () => {
  const { messages, isLoading } = useChat();
  return <Text testID="test-component">{`Messages: ${messages.length}, Loading: ${isLoading}`}</Text>;
};

describe('ChatContext', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('should provide default context values', () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ChatProvider>
          <TestComponent />
        </ChatProvider>
      </QueryClientProvider>
    );

    const testComponent = getByTestId('test-component');
    expect(testComponent.props.children).toBe('Messages: 0, Loading: false');
  });

  it('should render ChatProvider without crashing', () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ChatProvider>
          <Text testID="child">Test Child</Text>
        </ChatProvider>
      </QueryClientProvider>
    );

    expect(getByTestId('child')).toBeTruthy();
  });
});