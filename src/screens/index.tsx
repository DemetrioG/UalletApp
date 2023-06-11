import * as React from "react";
import { Platform, StatusBar, View } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-navigation";
import { toastConfig } from "../components/Toast/config";

import Routes from "../routes";
import styled from "styled-components";

export const App = () => {
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

const IphoneStatusBar = styled(View)`
  width: 100%;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

const StyledStatusBar = styled(StatusBar).attrs(({ theme: { theme } }) => ({
  barStyle:
    Platform.OS === "ios"
      ? !theme.isOnDarkTheme
        ? "dark-content"
        : "light-content"
      : null,
}))``;
