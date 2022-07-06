import * as React from "react";
import { Image, Text, TextProps, View, ViewProps } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";
import {
  ValueContainer as DefaultValueContainer,
  DescriptionContainer as DefaultDescriptionContainer,
  DescriptionText as DefaultDescriptionText,
} from "../../styles/general";

export const CardHeaderView: React.FC<
  ViewProps & { balance?: boolean }
> = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ balance }) => (balance ? metrics.baseMargin : 20)}px;
`;

export const CardHeaderText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.large}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const CardTextView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const LogoCard = styled(Image)`
  width: 20px;
  height: 25px;
`;

export const Balance: React.FC<TextProps & { negative?: boolean }> = styled(
  Text
)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.larger}px;
  color: ${({ theme: { theme }, negative }) =>
    !negative ? theme.blue : theme.red};
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

export const Section = styled(View)`
  flex-direction: row;
  padding: ${metrics.basePadding}px;
`;

export const SectionText = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: 20px;
  color: ${({ theme: { theme } }) => theme.tertiary};
`;

export const ValueContainer = styled(DefaultValueContainer)`
  width: 40%;
`;

export const DescriptionContainer = styled(DefaultDescriptionContainer)`
  flex: 1;
  border-right-width: 0px;
  align-items: baseline;
`;

export const DescriptionText = styled(DefaultDescriptionText)`
  color: ${({ theme: { theme } }) => theme.text};
`;
