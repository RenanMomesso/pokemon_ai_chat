
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
