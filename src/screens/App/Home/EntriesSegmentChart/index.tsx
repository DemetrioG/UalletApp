import { useContext, useEffect } from "react";

import { DataContext } from "../../../../context/Data/dataContext";
import SegmentChart from "../../../../components/SegmentChart";
import { useData } from "./hooks/useData";
import { HStack, Pressable, Text, VStack } from "native-base";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import Tooltip from "../../../../components/Tooltip";
import { InfoIcon } from "lucide-react-native";

export const EntriesSegmentChart = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data: dataContext } = useContext(DataContext);
  const { handleGetData, data, empty } = useData();

  useEffect(() => {
    handleGetData();
  }, [dataContext]);

  return (
    <VStack
      backgroundColor={theme?.secondary}
      borderRadius="30px"
      p={4}
      pt={5}
      pb={5}
      space={6}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontWeight={600}>Despesas por Segmento</Text>
        <Pressable>
          <Tooltip label="Despesas separadas pelos segmentos cadastrados">
            <InfoIcon color={theme?.text} />
          </Tooltip>
        </Pressable>
      </HStack>
      <SegmentChart
        data={data}
        empty={empty}
        emptyText="Parece que você não cadastrou nenhuma despesa para o período"
        screen="home"
      />
    </VStack>
  );
};
