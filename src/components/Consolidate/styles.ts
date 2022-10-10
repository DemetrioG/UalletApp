import * as React from "react";
import { View } from "react-native";
import { Center, HStack, Text } from "native-base";
import styled from "styled-components";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import { colors, fonts, metrics } from "../../styles";
import {
  ButtonSmall,
  ButtonText as GeneralButtonText,
} from "../../styles/general";

export const HeaderContainer = styled(Center)`
  flex-direction: row;
  justify-content: space-between;
`;

export const InfoContainer = styled(View)`
  padding: 30px 0px 10px 0px;
`;

export const IconContainer = styled(Center)`
  height: 170px;
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

export const HelperText = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: "md",
}))``;

export const Footer = styled(Center)`
  flex-direction: row;
  padding: 10px;
  padding-left: 90px;
`;

export const CirclesContainer = styled(HStack)`
  width: 40px;
  align-items: center;
  justify-content: space-around;
`;

export const Circle = styled(View)<{ isActive?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50px;
  background-color: ${({ isActive }) =>
    isActive ? colors.strongBlue : colors.gray};
`;

export const DataContainer = styled(View)`
  padding: 30px 0px 10px 0px;
`;

export const StyledButton = styled(ButtonSmall)`
  margin-bottom: 0px;
  margin-left: ${metrics.baseMargin}px;
`;

export const LabelContainer = styled(HStack)`
  margin-bottom: ${metrics.baseMargin}px;
`;

export const ButtonText = styled(GeneralButtonText)`
  font-size: 12px;
`;

export const ItemView = styled(HStack)`
  min-height: 43px;
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
  font-size: ${fonts.regular}px;
  color: ${colors.gray};
`;

export const ValueView = styled(ValueSize)`
  flex-direction: row;
  justify-content: center;
  padding: 0px ${metrics.basePadding / 2}px;
`;

export const ValueText = styled(Text).attrs(() => ({
  fontFamily: "mono",
  fontSize: fonts.regular,
}))<{ type: "Receita" | "Despesa" }>`
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
`;

export const ActionView = styled(ActionSize)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${metrics.basePadding / 2}px 0px;
`;

export const ButtonActionContainer = styled(View)<{
  type: "check" | "cancel";
}>`
  width: 28px;
  height: 28px;
  border-radius: 50px;
  padding-top: 4px;
  background-color: ${({ type, theme: { theme } }) =>
    type === "check" ? theme.green : theme.red};
`;

export const ActionText = styled(Text)<{ checked: boolean }>`
  text-align: center;
  font-size: ${fonts.regular}px;
  color: ${({ checked, theme: { theme } }) =>
    checked ? theme.green : theme.red};
`;
