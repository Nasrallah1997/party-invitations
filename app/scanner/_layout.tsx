import React from "react";
import { Stack } from "expo-router";
import Colors from "../../constants/colors";

export default function ScannerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.primary },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
