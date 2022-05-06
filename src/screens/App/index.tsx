import * as React from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Routes from "../../routes";
import { IphoneStatusBar, StyledStatusBar } from "./styles";

export default function App() {
  return (
    <SafeAreaProvider>
      {Platform.OS === "ios" && (
        // Backgound da StatusBar no iPhone
        <IphoneStatusBar />
      )}
      <StyledStatusBar />
      <Routes />
    </SafeAreaProvider>
  );
}
