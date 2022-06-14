import * as React from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import { fonts, metrics } from "../../styles";
import { StyledButton, DeleteButton } from "../../styles/general";

export const StyledLottieView: React.FC<
  AnimatedLottieViewProps & { type?: string }
> = styled(LottieView)`
  width: ${({ type }) => (type === "success" ? 180 : 150)}px;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const TextAlert = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.large}px;
  margin-bottom: ${metrics.doubleBaseMargin}px;
  text-align: center;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const ButtonContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const StyledButtonConfirm: typeof StyledButton = styled(StyledButton)`
  width: 100px;
  height: 35px;
`;

export const StyledButtonDelete: typeof StyledButton = styled(DeleteButton)`
  width: 100px;
  height: 35px;
`;
