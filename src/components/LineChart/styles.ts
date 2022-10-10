import * as React from "react";
import { TextProps, View, ViewProps } from "react-native";
import { ChartProps, LineChart } from "react-native-svg-charts";
import { IconProps } from "react-native-vector-icons/Icon";
import Feather from "react-native-vector-icons/Feather";
import styled from "styled-components";
import { fonts, metrics } from "../../styles";
import { Center, Text } from "native-base";

export const ChartContainer = styled(Center)`
  flex-direction: row;
`;

export const ChartView = styled(View)`
  padding: 18px;
  background-color: ${({ theme: { theme } }) => theme.primary};
  border-radius: ${metrics.baseRadius}px;
  width: 45%;
`;

export const LabelView: React.FC<ViewProps> = styled(View)`
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const StyledLineChart = styled(LineChart).attrs<{ data: number[][] }>(
  ({ theme: { theme }, data }) => ({
    data: [
      {
        data: data[0],
        svg: {
          stroke: theme.green,
          strokeWidth: 2,
        },
      },
      {
        data: data[1],
        svg: {
          stroke: theme.red,
          strokeWidth: 2,
        },
      },
    ],
    contentInset: {
      top: 5,
      bottom: 5,
    },
  })
)<{ data: number[][] }>`
  height: 60px;
`;

export const PercentualView = styled(View)`
  flex: 1;
  height: 110px;
  padding: ${metrics.basePadding * 1.5}px 0px;
  margin-left: ${metrics.baseMargin}px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

export const PercentualContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PercentualValue = styled(Text).attrs(() => ({
  fontFamily: "mono",
  fontWeight: 700,
  fontSize: "sm",
}))<{ percentual: number; type: "income" | "expense" }>`
  color: ${({ percentual, type, theme }) =>
    type === "income"
      ? percentual > -1
        ? theme.theme.green
        : theme.theme.red
      : percentual < 1
      ? theme.theme.green
      : theme.theme.red};
`;

type PercentualIcon = Omit<IconProps, "name"> & {
  percentual: number;
  type: "income" | "expense";
};

export const PercentualIcon: React.FC<PercentualIcon> = styled(
  Feather
).attrs<PercentualIcon>(({ percentual }) => ({
  name: percentual > -1 ? "arrow-up" : "arrow-down",
}))<PercentualIcon>`
  color: ${({ percentual, type, theme }) =>
    type === "income"
      ? percentual > -1
        ? theme.theme.green
        : theme.theme.red
      : percentual < 1
      ? theme.theme.green
      : theme.theme.red};
`;
