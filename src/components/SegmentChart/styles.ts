import { View } from "react-native";
import styled from "styled-components";
import { PieChart } from "react-native-svg-charts";
import { colors, metrics } from "../../styles";
import { Center, Text } from "native-base";
import React from "react";

type TPieChart = { data: number[] };
export const StyledPieChart: React.FC<TPieChart> = styled(
  PieChart
).attrs<TPieChart>(({ theme: { theme }, data }) => ({
  data: [
    {
      key: 1,
      value: data[0],
      svg: { fill: theme.colorPieChart[0] },
    },
    {
      key: 2,
      value: data[1],
      svg: { fill: theme.colorPieChart[1] },
    },
    {
      key: 3,
      value: data[2],
      svg: { fill: theme.colorPieChart[2] },
    },
    {
      key: 4,
      value: data[3],
      svg: { fill: theme.colorPieChart[3] },
    },
    {
      key: 5,
      value: data[4],
      svg: { fill: theme.colorPieChart[4] },
    },
  ],
}))<TPieChart>`
  height: 130px;
`;

export const ChartContainer = styled(Center)`
  flex-direction: row;
`;

export const PieChartLabel = styled(Text).attrs(() => ({
  fontFamily: "mono",
}))<{ x: number; y: number }>`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  color: ${colors.white};
`;

export const PieCenter = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-top: 50px;
  margin-left: 64px;
  background-color: ${({ theme: { theme } }) => theme.secondary};
`;

export const SegmentChartView = styled(View)`
  width: 50%;
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

export const DotView = styled(View).attrs<{ index: number }>(
  ({ theme: { theme }, index }) => ({
    backgroundColor: theme.colorPieChart[index],
  })
)<{ index: number }>`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  margin-top: 2px;
  margin-right: ${metrics.baseMargin / 2}px;
`;
