import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: "white",
      },
      animation: "fade"
      
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="user/index" />
      <Stack.Screen name="hqonboarding/index" />
      <Stack.Screen name="hq/index" />
    </Stack>
  );
}
