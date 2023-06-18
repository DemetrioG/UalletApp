import { HStack, Pressable, Progress, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import Tooltip from "../../../../components/Tooltip";
import { InfoIcon } from "lucide-react-native";
import { numberToReal } from "../../../../utils/number.helper";

export const Planning = () => {
  const { theme }: IThemeProvider = useTheme();
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
        {progressTypes.map((item, index) => {
          return (
            <VStack paddingY={3}>
              <HStack
                key={index}
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Text fontWeight={500}>{item.name}</Text>
                <Text fontSize="14px">
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
      </VStack>
    </VStack>
  );
};

const progressTypes = [
  {
    name: "Receita",
    realized: 4505,
    designed: 5500,
  },
  {
    name: "Despesas Fixas",
    realized: 4505,
    designed: 4750,
  },
  {
    name: "Despesas Variáveis",
    realized: 875,
    designed: 1500,
  },
];
