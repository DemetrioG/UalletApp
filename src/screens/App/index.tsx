import * as React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-navigation";

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
    </SafeAreaView>
  );
};

export default App;
