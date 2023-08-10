import * as React from "react";
import { Platform, StatusBar, View } from "react-native";
import { VStack } from "native-base";
import styled from "styled-components";
import Toast from "react-native-toast-message";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Routes from "../routes";
import { toastConfig } from "../components/Toast/config";
import When from "../components/When";

export const App = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <VStack pt={insets.top}>
        <When is={Platform.OS === "ios"}>
          <IphoneStatusBar />
        </When>
        <StyledStatusBar />
      </VStack>
      <Routes />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
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
