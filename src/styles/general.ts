import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  Switch,
  SwitchProps,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";
import styled from "styled-components";
import colors from "./colors";
import metrics from "./metrics";
import fonts from "./fonts";
import React from "react";
import { DefaultTextInput } from "../components/TextInput";
import Feather from "react-native-vector-icons/Feather";
import { IconProps } from "react-native-vector-icons/Icon";
import Loader from "../components/Loader";
import { DefaultTextInputMask } from "../components/TextInputMask";
import Slider, { SliderProps } from "@react-native-community/slider";

export const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
`;

export const FlexContainer = styled(View)`
  flex: 1;
`;

export const BackgroundContainerCenter = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0px ${metrics.basePadding}px;
  padding-top: ${metrics.topBottomPadding}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const BackgroundContainer = styled(View)`
  flex: 1;
  padding: 0px ${metrics.basePadding}px;
  padding-top: ${metrics.topBottomPadding}px;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const ContainerCenter = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme: { theme } }) => theme.transparency};
`;

export const ModalView: React.FC<
  ViewProps & { height?: number | null; center?: boolean; filter?: boolean }
> = styled(View)`
  padding: ${metrics.topBottomPadding}px
    ${({ filter }) => (!filter ? `${metrics.basePadding}px` : null)};
  align-items: ${({ center }) => (center ? "center" : "null")};
  width: ${({ filter }) => (filter ? "350" : "294")}px;
  height: ${({ height }) => (height ? height + "px" : "auto")};
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
  margin-bottom: 75px;
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
  width: 250px;
`;

export const StyledSlider: React.FC<SliderProps> = styled(Slider).attrs(
  ({ theme: { theme } }) => ({
    thumbTintColor: theme.blue,
    minimumTrackTintColor: theme.blue,
    maximumTrackTintColor: colors.gray,
  })
)``;

export const StyledButton: React.FC<
  TouchableOpacityProps & { additionalMargin?: number; small?: boolean }
> = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  background-color: ${colors.strongBlue};
  border-radius: ${({ small }) =>
    !small ? metrics.mediumRadius : metrics.smallRadius}px;
  margin-bottom: ${({ additionalMargin }) =>
    additionalMargin ? additionalMargin : metrics.smallMargin}px;
  width: ${({ small }) => (!small ? 250 : 80)}px;
  height: ${({ small }) => (!small ? 45 : 30)}px;
`;

export const StyledButtonOutline: typeof StyledButton = styled(StyledButton)`
  background-color: transparent;
  border-width: 1px;
  border-color: ${({ theme: { theme } }) => theme.blue};
`;

export const DeleteButton: typeof StyledButton = styled(StyledButton)`
  background-color: ${colors.lightRed};
`;

export const ButtonText = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
  color: ${colors.white};
`;

export const ButtonOutlineText = styled(Text)`
  color: ${({ theme: { theme } }) => theme.blue};
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
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

export const TextHeader = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.largest}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-top: ${metrics.baseMargin}px;
`;

export const TextUalletHeader = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.big}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-left: ${metrics.baseMargin}px;
`;

export const TextHeaderScreen: React.FC<
  TextProps & { noMarginBottom?: boolean }
> = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.large}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-bottom: ${({ noMarginBottom }) =>
    noMarginBottom ? 0 : metrics.baseMargin}px;
`;

export const HeaderTitleContainer = styled(View)`
  margin-top: ${metrics.doubleBaseMargin}px;
  padding: 0px ${metrics.basePadding}px;
`;

export const HeaderTitle = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const StyledTextInput: typeof DefaultTextInput = styled(
  DefaultTextInput
).attrs(() => ({
  placeholderTextColor: colors.lightGray,
}))`
  width: 100%;
  height: 45px;
  padding: 5px 20px;
  border-radius: ${metrics.mediumRadius}px;
  border: 1px solid ${colors.lightGray};
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.regular}px;
  margin-bottom: ${metrics.baseMargin}px;
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
  width: 140px;
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

export const StyledIcon: React.FC<
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

export const StyledLoader: React.FC<{
  width: number;
  height: number;
  radius?: number;
}> = styled(Loader).attrs(({ theme: { theme }, radius }) => ({
  fg: theme.primary,
  bg: theme.secondary,
  radius: radius ? radius : metrics.mediumRadius,
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
`;

export const Label = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const StyledSwitch: React.FC<SwitchProps> = styled(Switch).attrs(
  ({ theme: { theme } }) => ({
    thumbColor: colors.strongBlue,
    trackColor: {
      true: colors.lightBlue,
      false: theme.isOnDarkTheme ? colors.infoBlack : colors.gray,
    },
  })
)`
  margin-left: 5px;
`;
