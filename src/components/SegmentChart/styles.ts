import React from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-svg-charts";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

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

export const ChartContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const PieChartLabel = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: ${fonts.medium}px;
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

export const DotView: React.FC<{ index: number }> = styled(View).attrs(
  ({ theme: { theme }, index }) => ({
    backgroundColor: theme.colorPieChart[index],
  })
)`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  margin-top: 2px;
  margin-right: ${metrics.baseMargin / 2}px;
`;

export const SegmentLabelText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
`;
