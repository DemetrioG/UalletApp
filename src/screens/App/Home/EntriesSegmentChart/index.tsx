import { useContext, useEffect } from "react";

import { DataContext } from "../../../../context/Data/dataContext";
import { SegmentChart } from "../../../../components/SegmentChart";
import { useData } from "./hooks/useData";
import { HStack, Pressable, Skeleton, Text, VStack } from "native-base";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import Tooltip from "../../../../components/Tooltip";
import { InfoIcon } from "lucide-react-native";
import When from "../../../../components/When";

export const EntriesSegmentChart = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data: dataContext } = useContext(DataContext);
  const { handleGetData, data, empty, isLoading } = useData();

  useEffect(() => {
    handleGetData();
  }, [dataContext]);

  return (
    <VStack
      backgroundColor={theme?.secondary}
      borderRadius="30px"
      p={4}
      space={3}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontWeight={600}>Despesas por Segmento</Text>
        <Pressable>
          <Tooltip label="Despesas separadas pelos segmentos cadastrados">
            <InfoIcon color={theme?.text} />
          </Tooltip>
        </Pressable>
      </HStack>
      <When is={isLoading}>
        <Skeleton
          h="110px"
          startColor={theme?.tertiary}
          rounded="20px"
          mt="10px"
        />
      </When>
      <When is={!isLoading}>
        <VStack pb={2}>
          <SegmentChart data={data} empty={empty} />
        </VStack>
      </When>
    </VStack>
  );
};
