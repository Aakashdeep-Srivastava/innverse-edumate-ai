// app/(root)/sign-in.tsx
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './lib/auth/auth-context';  // Updated import path
import { useState } from 'react';
import { router } from 'expo-router';

export default function SignIn() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn(phoneNumber, pin);
      router.replace('/(root)/(tabs)/explore');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 space-y-4">
        <Text className="text-2xl font-bold">Sign In</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="PIN"
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          keyboardType="numeric"
        />
        <TouchableOpacity
          className="bg-purple-700 rounded-lg p-4"
          onPress={handleSignIn}
        >
          <Text className="text-white text-center font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}