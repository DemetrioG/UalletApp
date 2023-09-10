import { Center, HStack, Text, VStack } from "native-base";

import { ChartProps } from "./types";
import When from "../When";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../styles/baseTheme";

export const SegmentChart = ({ data }: { data: ChartProps[] }) => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Center>
      <VStack width="100%">
        <VStack h={150} position="relative">
          <VStack position="absolute" w="100%" top={-30} left={-25}>
            <VictoryPie
              data={data}
              width={390}
              height={210}
              padAngle={3}
              cornerRadius={10}
              innerRadius={30}
              style={{
                labels: {
                  fill: theme?.text,
                },
              }}
              colorScale={colorScale}
              animate
            />
          </VStack>
        </VStack>
        <VStack width="100%" justifyContent="center">
          {data.map(({ x, y }, index) => {
            return (
              <When is={!!y} key={index}>
                <VStack justifyContent="center" paddingY={4}>
                  <HStack alignItems="center" space={4}>
                    <VStack
                      w="15px"
                      h="15px"
                      borderRadius="500px"
                      backgroundColor={colorScale[index]}
                    />
                    <Text
                      style={{
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      {x}
                    </Text>
                    <Text fontWeight={700}>{y.toFixed(0)}%</Text>
                  </HStack>
                </VStack>
              </When>
            );
          })}
        </VStack>
      </VStack>
    </Center>
  );
};

const colorScale = [
  "rgba(38, 109, 211, 1)",
  "rgba(38, 109, 211, 0.8)",
  "rgba(38, 109, 211, 0.6)",
  "rgba(38, 109, 211, 0.4)",
  "rgba(38, 109, 211, 0.2)",
  "rgba(127, 41, 130, 1)",
  "rgba(127, 41, 130, 0.8)",
  "rgba(127, 41, 130, 0.6)",
  "rgba(127, 41, 130, 0.4)",
  "rgba(127, 41, 130, 0.2)",
];
