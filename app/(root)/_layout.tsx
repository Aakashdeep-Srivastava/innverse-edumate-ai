// app/(root)/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from './lib/auth/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sign-in" />
      </Stack>
    </AuthProvider>
  );
}