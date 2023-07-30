import {
  HStack,
  Pressable,
  Progress,
  Skeleton,
  Text,
  VStack,
} from "native-base";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import Tooltip from "../../../../components/Tooltip";
import { InfoIcon } from "lucide-react-native";
import { numberToReal } from "../../../../utils/number.helper";
import { useGetPlanning } from "./hooks/usePlanning";
import When from "../../../../components/When";

export const Planning = () => {
  const { theme }: IThemeProvider = useTheme();
  const { isLoading, list } = useGetPlanning();

  return (
    <VStack backgroundColor={theme?.secondary} borderRadius="30px" p={4} pt={5}>
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
          <>
            {list.map((item, index) => {
              const bold = item.realized > item.designed;
              return (
                <VStack paddingY={3} key={index}>
                  <HStack
                    key={index}
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Text fontWeight={500}>{item.description}</Text>
                    <Text fontSize="14px" fontWeight={bold ? "bold" : "normal"}>
                      {numberToReal(item.realized).split(",")[0]}/
                      {numberToReal(item.designed).split(",")[0]}
                    </Text>
                  </HStack>
                  <Progress
                    backgroundColor={theme?.primary}
                    _filledTrack={{ bg: theme?.blue }}
                    value={(item.realized / item.designed) * 100}
                  />
                </VStack>
              );
            })}
          </>
        </When>
      </VStack>
    </VStack>
  );
};
