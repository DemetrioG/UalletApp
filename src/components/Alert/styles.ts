import * as React from "react";
import { Text, View } from "react-native";
import { Button } from "native-base";
import styled from "styled-components";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import { fonts, metrics } from "../../styles";
import { DeleteButton } from "../../styles/general";

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

export const StyledButtonConfirm = styled(Button)`
  width: 100px;
  height: 35px;
`;

export const StyledButtonDelete = styled(DeleteButton)`
  width: 100px;
  height: 35px;
`;

export const HelperText = styled(Text)`
  text-align: center;
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-bottom: ${metrics.doubleBaseMargin}px;
`;
