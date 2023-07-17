import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  View,
} from "react-native";
import {
  Button,
  Center,
  Flex,
  Text,
  Skeleton as NativeSkeleton,
  IButtonProps,
  HStack,
} from "native-base";
import NativeSlider from "@react-native-community/slider";
import styled from "styled-components";
import colors from "./colors";
import metrics from "./metrics";
import fonts from "./fonts";
import { IPHONE_BOTTOM_TAB } from "../utils/device.helper";
import { TEntrieType } from "../types/types";

export const BackgroundContainerCenter = styled(Center)`
  flex: 1;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const BackgroundContainer = styled(Flex)`
  flex: 1;
  background-color: ${({ theme: { theme } }) => theme.primary};
  overflow: hidden;
`;

export const ContainerCenter = styled(Center)`
  flex: 1;
`;

export const ModalContainer = styled(Center)`
  flex: 1;
  background-color: ${({ theme: { theme } }) => theme.transparency};
`;

export const ModalView = styled(View)<{ center?: boolean }>`
  width: 80%;
  padding: ${metrics.topBottomPadding}px;
  margin: 180px 0px;
  align-items: ${({ center }) => (center ? "center" : "null")};
  border-radius: ${metrics.baseRadius}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const ViewTab = styled(View)`
  flex: 1;
  padding: ${metrics.basePadding * 1.5}px;
  padding-bottom: 0px;
  margin-bottom: ${IPHONE_BOTTOM_TAB ? 100 : 75}px;
  border-radius: ${metrics.baseRadius}px;
  background-color: ${({ theme: { theme } }) => theme.secondary};
  min-height: 490px;
`;

export const FormContainer = styled(View)<{ insideApp?: boolean }>`
  padding: 0px ${({ insideApp }) => (!insideApp ? 50 : 35)}px;
`;

export const ButtonIcon = styled(Button).attrs<{ icon: JSX.Element }>(
  ({ icon }) => ({
    width: "12",
    minW: 0,
    minH: 0,
    p: 0,
    backgroundColor: "transparent",
    size: "sm",
    startIcon: icon,
    marginBottom: 0,
  })
)<{ icon: JSX.Element }>``;

export const ButtonText = styled(Text).attrs(() => ({
  fontFamily: "body",
  fontWeight: 800,
}))`
  color: ${colors.white};
`;

export const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).attrs(
  () => ({
    behavior: "padding",
    keyboardVerticalOffset: Platform.OS === "ios" ? -80 : 30,
  })
)`
  flex: 1;
`;

export const TextHeaderScreen = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: "md",
}))<{ noMarginBottom?: boolean }>`
  color: ${({ theme: { theme } }) => theme.text};
  margin-bottom: ${({ noMarginBottom }) =>
    noMarginBottom ? 0 : metrics.baseMargin}px;
`;

export const Label = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: 10px;
`;

export const DescriptionText = styled(Text)`
  color: ${colors.gray};
`;

export const ValueText = styled(Text).attrs(() => ({
  fontFamily: "mono",
}))<{ type: TEntrieType }>`
  font-size: 13px;
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
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
  border-radius: 200%;
  width: 400px;
  height: 400px;
  background-color: ${({ theme: { theme } }) =>
    theme.isOnDarkTheme ? theme.tertiary : theme.blue};
`;
