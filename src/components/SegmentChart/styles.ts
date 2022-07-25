import React from "react";
import { View, ViewProps } from "react-native";
import styled from "styled-components";
import { PieChart } from "react-native-svg-charts";
import { colors, fonts, metrics } from "../../styles";
import { Center, Text } from "native-base";

export const StyledPieChart: React.FC<{ data: number[] }> = styled(
  PieChart
).attrs(({ theme: { theme }, data }) => ({
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
}))`
  height: 130px;
`;

export const ChartContainer = styled(Center)`
  flex-direction: row;
`;

export const PieChartLabel = styled(Text)`
  font-size: ${fonts.medium}px;
  font-family: ${fonts.montserratMedium};
  color: ${colors.white};
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

export const DotView: React.FC<ViewProps & { index: number }> = styled(
  View
).attrs(({ theme: { theme }, index }) => ({
  backgroundColor: theme.colorPieChart[index],
}))`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  margin-top: 2px;
  margin-right: ${metrics.baseMargin / 2}px;
`;

export const SegmentLabelText = styled(Text)`
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
`;
