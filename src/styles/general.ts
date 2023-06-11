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
import { SafeAreaView } from "react-navigation";
import { IPHONE_BOTTOM_TAB } from "../utils/device.helper";
import { TEntryType } from "../types/types";

export const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
`;

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

export const Balance = styled(Text).attrs(() => ({
  fontFamily: "mono",
  fontWeight: 700,
  fontSize: fonts.larger,
}))<{ negative?: boolean }>`
  color: ${({ theme: { theme }, negative }) =>
    !negative ? theme.blue : theme.red};
`;

export const ModalView = styled(View)<{ center?: boolean }>`
  width: 80%;
  padding: ${metrics.topBottomPadding}px;
  margin: 180px 0px;
  align-items: ${({ center }) => (center ? "center" : "null")};
  border-radius: ${metrics.baseRadius}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const ScrollViewTab: React.FC<ScrollViewProps> = styled(ScrollView)`
  border: 1px solid red;
  margin-bottom: ${metrics.doubleBaseMargin * 2.5}px;
  border-bottom-left-radius: ${metrics.baseRadius}px;
  border-bottom-right-radius: ${metrics.baseRadius}px;
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

export const ButtonDelete: React.FC<IButtonProps> = styled(Button)`
  background-color: ${({ theme: { theme } }) => theme.red};
`;

export const ButtonOutline: React.FC<IButtonProps> = styled(Button).attrs(
  ({ theme: { theme } }) => ({
    variant: "outline",
    borderColor: theme.blue,
  })
)``;

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

export const ButtonSmall = styled(Button).attrs(() => ({
  minW: "20",
  minH: 0,
  padding: 0,
  h: 8,
  size: "sm",
}))``;

export const ButtonOutlineSmall: typeof ButtonOutline = styled(
  ButtonOutline
).attrs(() => ({
  minW: "20",
  minH: 0,
  padding: 0,
  h: 8,
  size: "sm",
}))``;

export const ButtonDeleteSmall: typeof ButtonDelete = styled(
  ButtonDelete
).attrs(() => ({
  minW: "20",
  minH: 0,
  padding: 0,
  h: 8,
  size: "sm",
}))``;

export const ButtonText = styled(Text).attrs(() => ({
  fontFamily: "body",
  fontWeight: 800,
}))`
  color: ${colors.white};
`;

export const ButtonOutlineText = styled(Text).attrs(() => ({
  fontWeight: 800,
}))`
  color: ${({ theme: { theme } }) => theme.blue};
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

export const Card = styled(View)`
  padding: 20px;
  background-color: ${({ theme: { theme } }) => theme.secondary};
  border-radius: ${metrics.baseRadius}px;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const Skeleton = styled(NativeSkeleton).attrs<{ secondary?: boolean }>(
  ({ secondary, theme: { theme } }) => ({
    startColor: secondary ? theme.secondary : theme.primary,
  })
)<{ secondary?: boolean }>``;

export const ButtonHeaderView = styled(HStack)`
  align-items: center;
  justify-content: space-between;
`;

export const SpaceAroundView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 10px;
`;

export const Label = styled(Text).attrs(() => ({
  fontWeight: 700,
}))`
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: 10px;
`;

export const ItemContainer = styled(HStack)``;

export const DescriptionContainer = styled(Center)`
  width: 50%;
  border-right-width: 1px;
  border-right-color: ${colors.lightPrimary};
  padding: ${metrics.basePadding / 2}px;
`;

export const DescriptionText = styled(Text)`
  color: ${colors.gray};
`;

export const ValueContainer = styled(View)`
  width: 40%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 8px;
`;

export const ValueText = styled(Text).attrs(() => ({
  fontFamily: "mono",
}))<{ type: TEntryType }>`
  font-size: 13px;
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
`;

export const HalfContainer = styled(View)`
  width: 48%;
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
