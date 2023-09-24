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
  VictoryZoomContainer,
} from "victory-native";

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
              >
                <VictoryAxis
                  dependentAxis
                  tickFormat={(value) => `R$${value}`}
                />
                <VictoryAxis tickValues={categories} />
                {/* <VictoryZoomContainer allowZoom={false} /> */}
                <VictoryGroup colorScale={["#6499E3", "#266DD3"]} offset={45}>
                  <VictoryBar
                    data={realizedData}
                    cornerRadius={{ top: 6 }}
                    barWidth={60}
                  />
                  <VictoryBar
                    data={designedData}
                    cornerRadius={{ top: 6 }}
                    barWidth={60}
                  />
                </VictoryGroup>
              </VictoryChart>
              <HStack justifyContent="center" space={6} pb={5}>
                <HStack alignItems="center" space={2}>
                  <VStack
                    width="15px"
                    height="15px"
                    borderRadius={20}
                    backgroundColor="#6499E3"
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
