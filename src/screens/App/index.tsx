import * as React from "react";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-navigation";
import { toastConfig } from "../../components/Toast/config";

import Routes from "../../routes";
import { IphoneStatusBar, StyledStatusBar } from "./styles";

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === "ios" && (
        // Backgound da StatusBar no iPhone
        <IphoneStatusBar />
      )}
      <StyledStatusBar />
      <Routes />
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default App;
