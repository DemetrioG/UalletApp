import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  Switch,
  SwitchProps,
  TextProps,
  View,
  ViewProps,
} from "react-native";
import {
  Button,
  Center,
  Flex,
  Text,
  Skeleton as NativeSkeleton,
  ISkeletonProps,
} from "native-base";
import styled from "styled-components";
import colors from "./colors";
import metrics from "./metrics";
import fonts from "./fonts";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { IconProps } from "react-native-vector-icons/Icon";
import { DefaultTextInputMask } from "../components/TextInputMask";
import Slider, { SliderProps } from "@react-native-community/slider";
import { SafeAreaView } from "react-navigation";
import { IPHONE_BOTTOM_TAB } from "../utils/device.helper";
import { InterfaceTextProps } from "native-base/lib/typescript/components/primitives/Text/types";

export const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
`;

export const FlexContainer = styled(View)`
  flex: 1;
`;

export const BackgroundContainerCenter = styled(Center)`
  flex: 1;
  padding: ${metrics.topBottomPadding}px ${metrics.basePadding}px 0px
    ${metrics.basePadding}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const BackgroundContainer = styled(Flex)`
  flex: 1;
  padding: ${metrics.topBottomPadding}px ${metrics.basePadding}px 0px
    ${metrics.basePadding}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const ContainerCenter = styled(Center)`
  flex: 1;
`;

export const ModalContainer = styled(Center)`
  flex: 1;
  background-color: ${({ theme: { theme } }) => theme.transparency};
`;

export const ModalView: React.FC<
  ViewProps & { height?: number | null; center?: boolean; large?: boolean }
> = styled(View)`
  width: 80%;
  padding: ${metrics.topBottomPadding}px;
  margin: 180px 0px;
  align-items: ${({ center }) => (center ? "center" : "null")};
  border-radius: ${metrics.baseRadius}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const ScrollViewTab: React.FC<ScrollViewProps> = styled(ScrollView)`
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
  min-height: 500px;
`;

export const ViewTabContent: React.FC<
  ViewProps & { noPaddingBottom?: boolean }
> = styled(View)`
  flex: 1;
  padding-bottom: ${({ noPaddingBottom }) =>
    noPaddingBottom ? 0 : metrics.basePadding * 1.5}px;
  background-color: ${({ theme: { theme } }) => theme.secondary};
`;

export const FormContainer = styled(View)`
  padding: 0px 50px;
`;

export const StyledSlider: React.FC<SliderProps> = styled(Slider).attrs(
  ({ theme: { theme } }) => ({
    thumbTintColor: theme.blue,
    minimumTrackTintColor: theme.blue,
    maximumTrackTintColor: colors.gray,
  })
)``;

export const ButtonOutline = styled(Button).attrs(({ theme: { theme } }) => ({
  variant: "outline",
  borderColor: theme.blue,
}))``;

export const ButtonSmall = styled(Button).attrs(() => ({
  minW: "24",
  minH: 0,
  size: "sm",
}))``;

export const ButtonOutlineSmall = styled(ButtonOutline).attrs(() => ({
  minW: 0,
  minH: 0,
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

export const DeleteButton = styled(Button)`
  background-color: ${colors.lightRed};
`;

export const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).attrs(
  () => ({
    behavior: "padding",
    keyboardVerticalOffset: Platform.OS === "ios" ? -80 : -280,
  })
)`
  flex: 1;
`;

export const LogoHeader = styled(View)`
  flex-direction: row;
  align-items: baseline;
  padding: 0px ${metrics.basePadding}px;
`;

export const Logo = styled(Image)`
  width: 48px;
  height: 58px;
`;

export const TextHeader: React.FC<
  InterfaceTextProps & { withMarginLeft?: boolean; withMarginTop?: boolean }
> = styled(Text).attrs(() => ({
  fontWeight: 800,
}))`
  color: ${({ theme: { theme } }) => theme.text};
  ${({ withMarginLeft, withMarginTop }) => {
    if (withMarginLeft) {
      return `
      margin-left: ${metrics.baseMargin}px;
      `;
    } else if (withMarginTop) {
      return `
      margin-top: ${metrics.baseMargin}px;
      `;
    }
  }}
`;

export const TextHeaderScreen: React.FC<
  TextProps & { noMarginBottom?: boolean }
> = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: "md",
}))`
  color: ${({ theme: { theme } }) => theme.text};
  margin-bottom: ${({ noMarginBottom }) =>
    noMarginBottom ? 0 : metrics.baseMargin}px;
`;

export const HeaderTitleContainer = styled(View)`
  margin-top: ${metrics.doubleBaseMargin}px;
  padding: 0px ${metrics.basePadding}px;
`;

export const HeaderTitle = styled(Text)`
  color: ${({ theme: { theme } }) => theme.text};
`;

export const StyledTextInputMask: typeof DefaultTextInputMask = styled(
  DefaultTextInputMask
).attrs(() => ({
  placeholderTextColor: colors.lightGray,
}))`
  width: 100%;
  height: 45px;
  padding: 5px 20px;
  border-radius: ${metrics.mediumRadius}px;
  border: 1px solid ${colors.lightGray};
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.regular}px;
  margin-bottom: ${metrics.baseMargin}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const StyledInputDate = styled(StyledTextInputMask)`
  width: 150px;
  height: 30px;
  border-radius: ${metrics.smallRadius}px;
  margin-bottom: 0px;
`;

export const StyledLoading = styled(ActivityIndicator).attrs(() => ({
  size: 20,
  color: colors.white,
}))``;

export const Card = styled(View)`
  padding: 20px;
  background-color: ${({ theme: { theme } }) => theme.secondary};
  border-radius: ${metrics.baseRadius}px;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const Icon: React.FC<
  IconProps & { color?: string; size?: number; colorVariant?: string }
> = styled(Feather).attrs(
  ({ theme: { theme }, color, size, colorVariant }) => ({
    color: colorVariant ? theme[colorVariant] : color ? color : theme.text,
    size: size ? size : metrics.iconSize,
  })
)`
  text-align: center;
  text-align-vertical: bottom;
`;

export const Skeleton: React.FC<
  ISkeletonProps & { secondary?: boolean }
> = styled(NativeSkeleton).attrs(({ secondary, theme: { theme } }) => ({
  startColor: secondary ? theme.secondary : theme.primary,
}))``;

export const ButtonHeaderView = styled(View)`
  margin-bottom: ${metrics.baseMargin}px;
  flex-direction: row;
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

export const StyledSwitch: React.FC<SwitchProps> = styled(Switch).attrs(
  ({ theme: { theme } }) => ({
    thumbColor: colors.strongBlue,
    trackColor: {
      true: colors.lightBlue,
      false: theme.isOnDarkTheme ? colors.infoBlack : colors.gray,
    },
  })
)``;

export const ItemContainer = styled(View)`
  flex-direction: row;
`;

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

export const ValueText: React.FC<
  TextProps & { type: "Receita" | "Despesa" }
> = styled(Text).attrs(() => ({
  fontFamily: "mono",
}))`
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
`;
