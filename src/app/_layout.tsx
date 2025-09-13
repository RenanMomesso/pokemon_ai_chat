
// Remove or replace with appropriate fetch polyfill if needed
// Remove expo-fetch import since it's not needed or doesn't exist
// If fetch polyfill is required, consider using cross-fetch or node-fetch instead
import { Stack } from "expo-router";
import { ChatProvider } from '../contexts';
import { QueryProvider } from '../providers/QueryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <ChatProvider>
        <Stack>
          <Stack.Screen name="index"  options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="chat" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </ChatProvider>
    </QueryProvider>
  );
}
