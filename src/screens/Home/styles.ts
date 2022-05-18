import * as React from "react";
import {
  Image,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const CardHeaderView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${metrics.baseMargin / 2}px;
`;

export const CardHeaderText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const CardTextView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const IconContainer: React.FC<
  TouchableOpacityProps & { marginTop?: number }
> = styled(TouchableOpacity)`
  margin-left: ${metrics.baseMargin}px;
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : 0)}px;
`;

export const LogoCard = styled(Image)`
  width: 20px;
  height: 25px;
`;

export const Balance = styled(Text)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.larger}px;
  color: ${({ theme: { theme } }) => theme.blue};
`;

export const Invest = styled(Text)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.larger}px;
  margin-bottom: ${metrics.baseMargin}px;
  color: ${({ theme: { theme } }) =>
    !theme.isOnDarkTheme ? colors.strongPurple : colors.yellow};
`;

export const CardStatusView = styled(View)`
  margin-bottom: ${metrics.baseMargin}px;
`;

export const StatusText: React.FC<TextProps & { bold?: boolean }> = styled(
  Text
)`
  font-family: ${({ bold }) =>
    bold ? fonts.ralewayExtraBold : fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const StatusPercentText = styled(Text)`
  font-family: ${fonts.montserratExtraBold};
  color: ${({ theme: { theme } }) => theme.green};
`;

export const CardFooterText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: ${metrics.baseMargin / 2}px;
`;

export const InvestPercentual = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: 14px;
  color: ${({ theme: { theme } }) => theme.green};
`;
