import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Center, Flex } from "native-base";
import NativeSlider from "@react-native-community/slider";
import styled from "styled-components";

export const BackgroundContainerCenter = styled(Center)`
  flex: 1;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const BackgroundContainer = styled(Flex)`
  flex: 1;
  background-color: ${({ theme: { theme } }) => theme.primary};
  overflow: hidden;
`;

export const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).attrs(
  () => ({
    behavior: "padding",
    keyboardVerticalOffset: Platform.OS === "ios" ? -80 : 30,
  })
)`
  flex: 1;
`;

export const Slider = styled(NativeSlider).attrs<{ colorVariant?: string }>(
  ({ colorVariant, theme: { theme } }) => ({
    thumbTintColor: colorVariant ? theme[colorVariant] : theme.blue,
    minimumTrackTintColor: colorVariant ? theme[colorVariant] : theme.blue,
    maximumTrackTintColor: theme.gray,
  })
)<{ colorVariant?: string }>``;

export const BackgroundEffect = styled(View)`
  position: absolute;
  top: -10%;
  left: -20%;
  border-radius: 500px;
  width: 450px;
  height: 450px;
  background-color: ${({ theme: { theme } }) =>
    theme.isOnDarkTheme ? theme.tertiary : theme.blue};
`;
