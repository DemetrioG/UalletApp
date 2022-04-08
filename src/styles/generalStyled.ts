import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components";
import colors from "./colors";
import metrics from "./metrics";
import fonts from "./fonts";

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

export const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  background-color: ${colors.strongBlue};
  border-radius: ${metrics.mediumRadius};
  margin-bottom: ${metrics.smallMargin};
  width: 250;
  height: 45;
`;

export const StyledButtonOutline = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-width: 2;
  border-color: ${({ theme }) => theme.theme.blue};
  border-radius: ${metrics.mediumRadius};
  margin-bottom: ${({ additionalMargin }) =>
    additionalMargin ? additionalMargin : metrics.smallMargin};
  width: 250;
  height: 45;
`;

export const ButtonText = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular};
  color: ${colors.white};
`;

export const ButtonOutlineText = styled(Text)`
  color: ${({ theme }) => theme.theme.blue};
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.regular};
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

export const TextUalletHeader = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.big};
  color: ${({ theme }) => theme.theme.text};
  margin-left: ${metrics.baseMargin};
`;

export const HeaderTitleContainer = styled(View)`
  margin-top: ${metrics.doubleBaseMargin};
  padding: 0px ${metrics.basePadding}px;
`;

export const HeaderTitle = styled(Text)`
  font-family: ${fonts.ralewayBold};
  font-size: ${fonts.medium};
  color: ${({ theme }) => theme.theme.text};
`;
