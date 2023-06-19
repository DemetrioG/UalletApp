import React from "react";
import styled from "styled-components";
import { PieChart } from "react-native-svg-charts";

type TPieChart = { data: number[]; children: Element[] | Element };
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
  height: 110px;
`;
