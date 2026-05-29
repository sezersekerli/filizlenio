import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0a120e" },
          headerTintColor: "#22c55e",
          contentStyle: { backgroundColor: "#0a120e" },
        }}
      />
    </>
  );
}
