import * as React from "react";
import { Text, TextProps, View } from "react-native";
import styled from "styled-components";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import { colors, fonts, metrics } from "../../styles";
import {
  StyledButton as GeneralStyledButton,
  ButtonText as GeneralButtonText,
} from "../../styles/general";

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: space-between;
`;

export const Content = styled(View)``;

export const InfoContainer = styled(View)`
  padding: 40px 0px 10px 0px;
`;

export const InfoText = styled(Text)`
  text-align: center;
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const IconContainer = styled(View)`
  height: 170px;
  align-items: center;
  justify-content: center;
`;

export const StyledLottieView: React.FC<AnimatedLottieViewProps> = styled(
  LottieView
)`
  width: 250px;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const HelperContainer = styled(View)`
  padding: 10px;
`;

export const HelperText = styled(Text)`
  text-align: center;
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.large}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const Footer = styled(View)`
  flex-direction: row;
  padding: 10px;
  padding-left: 100px;
  align-items: center;
  justify-content: center;
`;

export const CirclesContainer = styled(View)`
  width: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const Circle: React.FC<{ isActive?: boolean }> = styled(View)`
  width: 10px;
  height: 10px;
  border-radius: 50px;
  background-color: ${({ isActive, theme: { theme } }) =>
    isActive ? colors.strongBlue : colors.gray};
`;

export const DataContainer = styled(View)`
  padding: 40px 0px 10px 0px;
`;

export const StyledButton = styled(GeneralStyledButton)`
  margin-bottom: 0px;
  margin-left: ${metrics.baseMargin}px;
`;

export const LabelContainer = styled(View)`
  flex-direction: row;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const ButtonText = styled(GeneralButtonText)`
  font-size: 10px;
`;

export const ItemView = styled(View)`
  flex-direction: row;
  height: 43px;
`;

export const DescriptionSize = styled(View)`
  width: 35%;
  align-items: center;
`;

export const ValueSize = styled(View)`
  width: 40%;
  align-items: center;
`;

export const ActionSize = styled(View)`
  width: 25%;
  align-items: center;
`;

export const DescriptionView = styled(DescriptionSize)`
  justify-content: center;
  padding: ${metrics.basePadding / 2}px;
`;

export const DescriptionText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${colors.gray};
`;

export const ValueView = styled(ValueSize)`
  flex-direction: row;
  justify-content: center;
  padding: 0px ${metrics.basePadding / 2}px;
`;

export const ValueText: React.FC<
  TextProps & { type: "Receita" | "Despesa" }
> = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
`;

export const ActionView = styled(ActionSize)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${metrics.basePadding / 2}px 0px;
`;

export const ButtonActionContainer: React.FC<{
  type: "check" | "cancel";
}> = styled(View)`
  width: 28px;
  height: 28px;
  border-radius: 50px;
  padding-top: 4px;
  background-color: ${({ type, theme: { theme } }) =>
    type === "check" ? theme.green : theme.red};
`;

export const ActionText: React.FC<{ checked: boolean }> = styled(Text)`
  text-align: center;
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ checked, theme: { theme } }) =>
    checked ? theme.green : theme.red};
`;
