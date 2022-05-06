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
import Feather from "react-native-vector-icons/Feather";
import { ChartProps, LineChart, PieChart } from "react-native-svg-charts";
import { colors, fonts, metrics } from "../../styles";
import { IconProps } from "react-native-vector-icons/Icon";

export const PieChartLabel = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: ${fonts.medium}px;
  color: ${colors.white};
`;

export const CardHeaderView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${metrics.baseMargin / 2}px;
`;

export const CardHeaderText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${({ theme }) => theme.theme.text};
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
  color: ${({ theme }) => theme.theme.blue};
`;

export const Invest = styled(Text)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.larger}px;
  margin-bottom: ${metrics.baseMargin}px;
  color: ${({ theme }) =>
    !theme.theme.isOnDarkTheme ? colors.strongPurple : colors.yellow};
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
  color: ${({ theme }) => theme.theme.text};
`;

export const StatusPercentText = styled(Text)`
  font-family: ${fonts.montserratExtraBold};
  color: ${({ theme }) => theme.theme.green};
`;

export const CardFooterText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme }) => theme.theme.text};
  margin-right: ${metrics.baseMargin / 2}px;
`;

export const InvestPercentual = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: 14px;
  color: ${({ theme }) => theme.theme.green};
`;

export const IncomeChartView = styled(View)`
  padding: 18px;
  background-color: ${({ theme }) => theme.theme.primary};
  border-radius: ${metrics.baseRadius}px;
  width: 45%;
`;

export const StyledLineChart: React.FC<ChartProps<any>> = styled(
  LineChart
).attrs(() => ({
  contentInset: {
    top: 5,
    bottom: 5,
  },
}))`
  height: 60px;
`;

export const IncomeChartLabelView = styled(View)`
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.theme.primary};
`;

export const IncomeChartLabelText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme }) => theme.theme.text};
`;

export const IncomeView = styled(View)`
  flex: 1;
  padding: ${metrics.basePadding * 1.5}px 0px;
  margin-left: ${metrics.baseMargin}px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

export const PercentualText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme }) => theme.theme.text};
  margin-right: ${metrics.baseMargin / 2}px;
`;

export const PercentualValue: React.FC<
  TextProps & { percentual: number; type: "income" | "expense" }
> = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: ${fonts.regular}px;
  color: ${({ percentual, type, theme }) =>
    type === "income"
      ? percentual > 0
        ? theme.theme.green
        : theme.theme.red
      : percentual < 0
      ? theme.theme.green
      : theme.theme.red};
`;

export const PercentualIcon: React.FC<
  Omit<IconProps, "name"> & { percentual: number; type: "income" | "expense" }
> = styled(Feather).attrs(({ percentual }) => ({
  name: percentual > 0 ? "arrow-up" : "arrow-down",
}))`
  color: ${({ percentual, type, theme }) =>
    type === "income"
      ? percentual > 0
        ? theme.theme.green
        : theme.theme.red
      : percentual < 0
      ? theme.theme.green
      : theme.theme.red};
`;

export const SegmentChartView = styled(View)`
  width: 50%;
`;

export const StyledPieChart = styled(PieChart)`
  height: 130px;
`;

export const SegmentLabelView = styled(View)`
  width: 50%;
  align-items: flex-start;
  justify-content: center;
`;

export const ContentLabel = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 3px;
  margin-left: ${metrics.baseMargin}px;
`;

export const DotView: React.FC<{ backgroundColor: string }> = styled(
  View
).attrs(({ backgroundColor }) => ({
  backgroundColor: backgroundColor,
}))`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  margin-top: 2px;
  margin-right: ${metrics.baseMargin / 2}px;
`;

export const SegmentLabelText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme }) => theme.theme.text};
`;
