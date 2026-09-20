import React from "react";
import { Stack } from "expo-router";
import Colors from "../../constants/colors";

export default function GuestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="invitation" />
    </Stack>
  );
}
