import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
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
  background-color: ${({ theme }) => theme.theme.primary};
`;

export const BackgroundContainer = styled(View)`
  flex: 1;
  padding: 0px ${metrics.basePadding}px;
  padding-top: ${metrics.topBottomPadding}px;
  background-color: ${({ theme }) => theme.theme.primary};
`;

export const ContainerCenter = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ScrollViewTab: React.FC<ScrollViewProps> = styled(ScrollView)`
  margin-bottom: ${metrics.doubleBaseMargin * 2.5}px;
  border-bottom-left-radius: ${metrics.baseRadius}px;
  border-bottom-right-radius: ${metrics.baseRadius}px;
`;

export const FormContainer = styled(View)`
  width: 250px;
`;

export const StyledButton: React.FC<
  TouchableOpacityProps & { additionalMargin?: number }
> = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  background-color: ${colors.strongBlue};
  border-radius: ${metrics.mediumRadius}px;
  margin-bottom: ${({ additionalMargin }) =>
    additionalMargin ? additionalMargin : metrics.smallMargin}px;
  width: 250px;
  height: 45px;
`;

export const StyledButtonOutline: React.FC<
  TouchableOpacityProps & { additionalMargin: number }
> = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-width: 2px;
  border-color: ${({ theme }) => theme.theme.blue};
  border-radius: ${metrics.mediumRadius}px;
  margin-bottom: ${({ additionalMargin }) =>
    additionalMargin ? additionalMargin : metrics.smallMargin}px;
  width: 250px;
  height: 45px;
`;

export const ButtonText = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
  color: ${colors.white};
`;

export const ButtonOutlineText = styled(Text)`
  color: ${({ theme }) => theme.theme.blue};
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
  color: ${({ theme }) => theme.theme.text};
  margin-top: ${metrics.baseMargin}px;
`;

export const TextUalletHeader = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.big}px;
  color: ${({ theme }) => theme.theme.text};
  margin-left: ${metrics.baseMargin}px;
`;

export const HeaderTitleContainer = styled(View)`
  margin-top: ${metrics.doubleBaseMargin}px;
  padding: 0px ${metrics.basePadding}px;
`;

export const HeaderTitle = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.medium}px;
  color: ${({ theme }) => theme.theme.text};
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
  border: 2px solid ${colors.lightGray};
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular}px;
  margin-bottom: ${metrics.baseMargin}px;
  color: ${({ theme }) => theme.theme.text};
`;

export const Card = styled(View)`
  padding: 20px;
  background-color: ${({ theme }) => theme.theme.secondary};
  border-radius: ${metrics.baseRadius}px;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const StyledIcon: React.FC<
  IconProps & { color?: string; size?: number }
> = styled(Feather).attrs(({ theme, color, size }) => ({
  color: color ? color : theme.theme.text,
  size: size ? size : metrics.iconSize,
}))``;

export const StyledLoader: React.FC<{
  width: number;
  height: number;
  radius?: number;
}> = styled(Loader).attrs(({ theme, radius }) => ({
  fg: theme.theme.primary,
  bg: theme.theme.secondary,
  radius: radius ? radius : metrics.mediumRadius,
}))``;
