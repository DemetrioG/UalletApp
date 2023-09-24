import { HStack, Pressable, Skeleton, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import Tooltip from "../../../../components/Tooltip";
import { InfoIcon } from "lucide-react-native";
import { numberToReal } from "../../../../utils/number.helper";
import { useGetPlanning } from "./hooks/usePlanning";
import When from "../../../../components/When";
import { EmptyChart } from "../../../../components/EmptyChart";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
} from "victory-native";
import { ScrollView } from "react-native";

export const Planning = () => {
  const { theme }: IThemeProvider = useTheme();
  const { isLoading, list } = useGetPlanning();
  const hasPlanning = !!list.length;

  const designedData = list.map((item, i) => {
    return { x: item.description, y: item.designed };
  });
  const realizedData = list.map((item, i) => {
    return { x: item.description, y: item.realized };
  });
  const categories = list.map((item) => item.description);

  return (
    <VStack
      backgroundColor={theme?.secondary}
      borderRadius={30}
      p={4}
      pt={5}
      space={3}
    >
      <HStack justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontWeight={600}>Planejamento</Text>
        <Pressable>
          <Tooltip label="Seus lançamentos Realizados/Projetados">
            <InfoIcon color={theme?.text} />
          </Tooltip>
        </Pressable>
      </HStack>
      <VStack>
        <When is={isLoading}>
          <Skeleton
            h="120px"
            startColor={theme?.tertiary}
            rounded="20px"
            mt="10px"
          />
        </When>
        <When is={!isLoading}>
          <When is={hasPlanning}>
            <VStack
              backgroundColor={theme?.primary}
              borderRadius={20}
              paddingX={4}
            >
              <ScrollView horizontal contentOffset={{ x: 20, y: 0 }}>
                <VictoryChart
                  theme={{
                    axis: {
                      style: {
                        axis: {
                          opacity: 0.3,
                          stroke: theme?.text,
                        },
                        grid: {
                          opacity: 0.08,
                          stroke: theme?.text,
                        },
                        tickLabels: {
                          fill: theme?.text,
                          padding: 10,
                        },
                      },
                    },
                  }}
                  width={categories.length * 200}
                >
                  <VictoryAxis tickValues={categories} />
                  <VictoryGroup colorScale={["#98BBEC", "#266DD3"]} offset={70}>
                    <VictoryBar
                      data={designedData}
                      cornerRadius={{ top: 6 }}
                      barWidth={60}
                      labels={({ datum }) => numberToReal(datum.y)}
                      labelComponent={
                        <VictoryLabel
                          dy={-10}
                          textAnchor="middle"
                          style={{ fill: theme?.text }}
                        />
                      }
                    />
                    <VictoryBar
                      data={realizedData}
                      cornerRadius={{ top: 6 }}
                      barWidth={60}
                      labels={({ datum }) => numberToReal(datum.y)}
                      labelComponent={
                        <VictoryLabel
                          dy={-10}
                          textAnchor="middle"
                          style={{ fill: theme?.text }}
                        />
                      }
                    />
                  </VictoryGroup>
                </VictoryChart>
              </ScrollView>
              <HStack justifyContent="center" space={6} pb={5}>
                <HStack alignItems="center" space={2}>
                  <VStack
                    width="15px"
                    height="15px"
                    borderRadius={20}
                    backgroundColor="#98BBEC"
                  />
                  <Text>Projetado</Text>
                </HStack>
                <HStack alignItems="center" space={2}>
                  <VStack
                    width="15px"
                    height="15px"
                    borderRadius={20}
                    backgroundColor="#266DD3"
                  />
                  <Text>Realizado</Text>
                </HStack>
              </HStack>
            </VStack>
          </When>
          <When is={!hasPlanning}>
            <EmptyChart
              actionText="Projete seu primeiro lançamento"
              route="Lancamentos"
            />
          </When>
        </When>
      </VStack>
    </VStack>
  );
};
