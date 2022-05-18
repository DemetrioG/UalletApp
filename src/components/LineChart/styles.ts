import { Text, TextProps, View } from "react-native";
import { ChartProps, LineChart } from "react-native-svg-charts";
import { IconProps } from "react-native-vector-icons/Icon";
import Feather from "react-native-vector-icons/Feather";
import styled from "styled-components";
import { fonts, metrics } from "../../styles";

export const ChartContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ChartView = styled(View)`
  padding: 18px;
  background-color: ${({ theme: { theme } }) => theme.primary};
  border-radius: ${metrics.baseRadius}px;
  width: 45%;
`;

export const LabelView = styled(View)`
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const LabelText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
`;

export const StyledLineChart: React.FC<ChartProps<any>> = styled(
  LineChart
).attrs(({ theme: { theme }, data }) => ({
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
}))`
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

export const PercentualText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme: { theme } }) => theme.text};
  margin-right: ${metrics.baseMargin / 2}px;
`;

export const PercentualValue: React.FC<
  TextProps & { percentual: number; type: "income" | "expense" }
> = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: ${fonts.regular}px;
  color: ${({ percentual, type, theme }) =>
    type === "income"
      ? percentual > -1
        ? theme.theme.green
        : theme.theme.red
      : percentual < 1
      ? theme.theme.green
      : theme.theme.red};
`;

export const PercentualIcon: React.FC<
  Omit<IconProps, "name"> & { percentual: number; type: "income" | "expense" }
> = styled(Feather).attrs(({ percentual }) => ({
  name: percentual > -1 ? "arrow-up" : "arrow-down",
}))`
  color: ${({ percentual, type, theme }) =>
    type === "income"
      ? percentual > -1
        ? theme.theme.green
        : theme.theme.red
      : percentual < 1
      ? theme.theme.green
      : theme.theme.red};
`;
