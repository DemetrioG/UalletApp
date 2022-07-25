import * as React from "react";
import { HStack, Text } from "native-base";
import styled from "styled-components";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import { fonts, metrics } from "../../styles";
import { ButtonDeleteSmall, ButtonSmall } from "../../styles/general";

export const StyledLottieView: React.FC<
  AnimatedLottieViewProps & { type?: string }
> = styled(LottieView)`
  width: ${({ type }) => (type === "success" ? 180 : 150)}px;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const TextAlert = styled(Text)`
  font-size: ${fonts.large}px;
  margin-bottom: ${metrics.doubleBaseMargin}px;
  text-align: center;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const ButtonContainer = styled(HStack)`
  width: 90%;
  justify-content: space-around;
`;

export const StyledButtonConfirm = styled(ButtonSmall)`
  width: 100px;
  height: 35px;
`;

export const StyledButtonDelete = styled(ButtonDeleteSmall)`
  width: 100px;
  height: 35px;
`;

export const HelperText = styled(Text).attrs(() => ({
  fontWeight: 700,
  fontSize: 'md'
}))`
  text-align: center;
  color: ${({ theme: { theme } }) => theme.text};
  margin-bottom: ${metrics.doubleBaseMargin}px;
`;
