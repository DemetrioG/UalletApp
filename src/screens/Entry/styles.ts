import React from "react";
import {
  Animated,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const ItemView = styled(View)`
  flex-direction: row;
`;

export const DescriptionView = styled(View)`
  width: 50%;
  align-items: center;
  justify-content: center;
  border-right-width: 1px;
  border-right-color: ${colors.lightPrimary};
  padding: ${metrics.basePadding / 2}px;
`;

export const DescriptionText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${colors.gray};
`;

export const ValueView = styled(View)`
  width: 40%;
  flex-direction: row;
  align-items: center;
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

export const MoreView = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  color: ${({ theme: { theme } }) => theme.blue};
`;

export const IncomeView = styled(View)`
  flex-direction: row;
  align-items: baseline;
  padding-bottom: ${metrics.basePadding}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightPrimary};
`;

export const IncomeText: React.FC<TextProps & { negative?: boolean }> = styled(
  Text
)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme }, negative }) =>
    !negative ? theme.blue : theme.red};
  margin-left: ${metrics.baseMargin / 2}px;
`;

export const AutoEntryView = styled(View)`
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-bottom: ${metrics.baseMargin}px;
`;

export const InfoView = styled(Animated.View)`
  padding: 5px;
  position: absolute;
  right: 5px;
  top: 45px;
  width: 130px;
  height: 40px;
  background-color: ${colors.infoBlack};
  border-radius: ${metrics.smallRadius}px;
`;

export const TriangleOfToolTip = styled(View)`
  position: absolute;
  width: 15px;
  height: 15px;
  top: -10px;
  right: 20px;
  border-top-width: 0px;
  border-right-width: 7px;
  border-bottom-width: 13px;
  border-left-width: 7px;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: ${colors.infoBlack};
  border-left-color: transparent;
`;

export const InfoText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: 10px;
  color: ${colors.white};
  text-align: center;
`;

export const RemoveFilterContainer = styled(View)`
  padding-bottom: ${metrics.basePadding}px;
`;

export const RemoveFilterText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: 3px;
  margin-bottom: 3px;
`;

export const RemoveFilterButton: React.FC<TouchableOpacityProps> = styled(
  TouchableOpacity
)`
  flex-direction: row;
  align-items: center;
`;

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;

export const InfoMonthText = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  font-size: ${fonts.large}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-left: 5px;
`;

export const LastEntryText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.large}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-bottom: ${metrics.baseMargin}px;
`;

export const BalanceLabelText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: 10px;
`;
