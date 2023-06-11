import React from "react";
import { LineChart } from "react-native-svg-charts";
import { Line } from "react-native-svg";
import { CompleteWrapper, Income, Wrapper } from "./styles";
import { HStack, Text, VStack } from "native-base";
import Icon from "@components/Icon";
import { TouchableOpacity } from "react-native";
import { fonts } from "@styles/index";

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
        <Text>Rendimentos</Text>
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
          <Text fontSize={fonts.regular}>Jan/2022</Text>
          <Text fontSize={fonts.regular}>Fev/2022</Text>
          <Text fontSize={fonts.regular}>Mar/2022</Text>
        </HStack>
      </Wrapper>
      <TouchableOpacity>
        <CompleteWrapper paddingX={5} paddingY={2}>
          <HStack alignItems={"center"}>
            <Text mr={1} fontSize={fonts.regular}>
              Ver evolução completa
            </Text>
            <Icon name="chevron-right" size={16} />
          </HStack>
        </CompleteWrapper>
      </TouchableOpacity>
    </VStack>
  );
};

export default EvolutionLineChart;
