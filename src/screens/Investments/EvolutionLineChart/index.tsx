import React from "react";
import { LineChart } from "react-native-svg-charts";
import { Line } from "react-native-svg";
import { CompleteWrapper, Income, Label, Title, Wrapper } from "./styles";
import { HStack, VStack } from "native-base";
import Icon from "../../../components/Icon";
import { TouchableOpacity } from "react-native";

const data = [50, 10, 40, 95, -4, -24];

const HorizontalLine = ({ y }: { y?: Function }) => (
  <Line
    key={"zero-axis"}
    x1={"0%"}
    x2={"100%"}
    y1={y && y(0)}
    y2={y && y(0)}
    stroke={"grey"}
    strokeDasharray={[4, 8]}
    strokeWidth={2}
  />
);

const EvolutionLineChart = () => {
  return (
    <VStack>
      <Wrapper mt={3} paddingY={5} paddingX={5}>
        <Title>Rendimentos</Title>
        <HStack mt={2} alignItems={"center"}>
          <Icon name="trending-up" colorVariant="green" size={18} />
          <Income ml={2}>R$ 10.347,89 - 16,70%</Income>
        </HStack>
        <VStack paddingX={8}>
          <LineChart
            style={{ height: 120 }}
            data={data}
            animate
            animationDuration={2000}
            svg={{
              stroke: "#6499E3",
              strokeWidth: 2,
            }}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <HorizontalLine />
          </LineChart>
        </VStack>
        <HStack justifyContent={"space-around"}>
          <Label>Jan/2022</Label>
          <Label>Fev/2022</Label>
          <Label>Mar/2022</Label>
        </HStack>
      </Wrapper>
      <TouchableOpacity>
        <CompleteWrapper paddingX={5} paddingY={2}>
          <HStack alignItems={"center"}>
            <Label mr={1}>Ver evolução completa</Label>
            <Icon name="chevron-right" size={16} />
          </HStack>
        </CompleteWrapper>
      </TouchableOpacity>
    </VStack>
  );
};

export default EvolutionLineChart;
