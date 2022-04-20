import * as React from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import { fonts, metrics } from "../../styles";

export const StyledLottieView: React.FC<AnimatedLottieViewProps> = styled(
  LottieView
)`
  width: 150px;
`;

export const TextAlert = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.large}px;
  margin-bottom: ${metrics.doubleBaseMargin}px;
  text-align: center;
  color: ${({ theme }) => theme.theme.text};
`;
