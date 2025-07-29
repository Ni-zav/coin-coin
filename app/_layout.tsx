import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { FinanceProvider } from '../contexts/FinanceContext';

import * as SystemUI from 'expo-system-ui';

useEffect(() => {
  SystemUI.setBackgroundColorAsync('#121212');
}, []);
export default function RootLayout() {
  useFrameworkReady();

  // Custom inner layout to use hooks
  function InnerLayout() {
    const insets = useSafeAreaInsets();
    
    // You can set this to match your app theme or system bar color
    const systemBarColor = '#121212'; // Example: dark mode

    return (
      <>
        <StatusBar style="light" backgroundColor={systemBarColor} />
        <SafeAreaView
          style={{
            flex: 1,
            // Apply all insets to ensure proper spacing
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: systemBarColor,
          }}
          // Specify which edges to apply insets to
          edges={["top", "bottom", "left", "right"]}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaView>
      </>
    );
  }

  return (
    <FinanceProvider>
      <SafeAreaProvider>
        <InnerLayout />
      </SafeAreaProvider>
    </FinanceProvider>
  );
}
