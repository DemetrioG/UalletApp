import { Center, HStack, Text, VStack } from "native-base";

import { ChartProps } from "./types";
import When from "../When";
import { VictoryPie } from "victory-native";

export const SegmentChart = ({ data }: { data: ChartProps[] }) => {
  return (
    <Center>
      <HStack>
        <VStack w="50%" h={150} position="relative">
          <VStack position="absolute" w="100%" top={-30} left={-25}>
            <VictoryPie
              data={data}
              width={200}
              height={200}
              padAngle={5}
              cornerRadius={15}
              innerRadius={25}
              colorScale={colorScale}
              animate
            />
          </VStack>
        </VStack>
        <VStack w="45%" justifyContent="center" space={1}>
          {data.map(({ x, y }, index) => {
            return (
              <When is={!!y} key={index}>
                <VStack justifyContent="center">
                  <HStack alignItems="center" space={2}>
                    <VStack
                      w="10px"
                      h="10px"
                      borderRadius="500px"
                      backgroundColor={colorScale[index]}
                    />
                    <Text fontSize="14px" fontWeight={700}>
                      {y.toFixed(0)}%
                    </Text>
                    <Text
                      fontSize="14px"
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      {x}
                    </Text>
                  </HStack>
                </VStack>
              </When>
            );
          })}
        </VStack>
      </HStack>
    </Center>
  );
};

const colorScale = [
  "rgba(38, 109, 211, 1)",
  "rgba(38, 109, 211, 0.8)",
  "rgba(38, 109, 211, 0.6)",
  "rgba(38, 109, 211, 0.4)",
  "rgba(38, 109, 211, 0.2)",
];
