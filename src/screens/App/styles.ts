import { Platform, StatusBar, View } from "react-native";
import styled from "styled-components";

export const IphoneStatusBar = styled(View)`
  width: 100%;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const StyledStatusBar = styled(StatusBar).attrs(
  ({ theme: { theme } }) => ({
    barStyle:
      Platform.OS === "ios"
        ? !theme.isOnDarkTheme
          ? "dark-content"
          : "light-content"
        : null,
  })
)``;
