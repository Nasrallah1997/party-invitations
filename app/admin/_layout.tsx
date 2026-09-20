import React from "react";
import { Stack } from "expo-router";
import Colors from "../../constants/colors";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="events" />
      <Stack.Screen name="create-event" />
      <Stack.Screen name="guests" />
      <Stack.Screen name="guest/[id]" />
    </Stack>
  );
}
