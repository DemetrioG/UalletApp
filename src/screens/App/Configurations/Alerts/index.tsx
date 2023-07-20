import { useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { HStack, Pressable, Text, VStack } from "native-base";

import { BackgroundContainer } from "../../../../styles/general";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { ChevronLeft, Edit3, PlusCircle, Trash } from "lucide-react-native";
import When from "../../../../components/When";
import { useDelete, useGetData } from "./hooks/useAlerts";

export const AlertsScreen = () => {
  const { theme }: IThemeProvider = useTheme();
  const { goBack, navigate } = useNavigation();
  const isFocused = useIsFocused();

  const { data, handleGetData } = useGetData();
  const { isLoading, handleDelete } = useDelete();

  const actions = [
    {
      label: "Despesas variáveis",
      url: "Configuracoes/Alertas/DespesasVariaveis",
      data: {
        index: "variableExpense",
        value: data?.variableExpense ?? 0,
      },
    },
  ];

  function goTo(url: string, params?: any) {
    navigate(url as never, params as never);
  }

  useEffect(() => {
    isFocused && handleGetData();
  }, [isFocused]);

  return (
    <BackgroundContainer>
      <VStack
        backgroundColor={theme?.secondary}
        flex={1}
        p={5}
        borderTopLeftRadius="30px"
        borderTopRightRadius="30px"
      >
        <HStack alignItems="center" space={3} mb={10}>
          <Pressable onPress={goBack}>
            <ChevronLeft color={theme?.text} />
          </Pressable>
          <Text fontWeight={700}>Alertas</Text>
        </HStack>
        {actions.map((action, index) => (
          <VStack key={index}>
            <When is={!action.data.value}>
              <Pressable onPress={() => goTo(action.url)}>
                <VStack
                  borderBottomWidth={1}
                  borderColor={theme?.primary}
                  p={4}
                >
                  <HStack justifyContent="space-between" alignItems={"center"}>
                    <Text>{action.label}</Text>
                    <PlusCircle color={theme?.text} />
                  </HStack>
                </VStack>
              </Pressable>
            </When>
            <When is={action.data.value}>
              <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
                <HStack justifyContent="space-between" alignItems={"center"}>
                  <Text>{action.label}</Text>
                  <HStack space={4}>
                    <Pressable
                      onPress={() => goTo(action.url, action.data.value)}
                    >
                      <Edit3 color={theme?.text} />
                    </Pressable>
                    <VStack>
                      <Pressable
                        onPress={() =>
                          handleDelete(action.data.index, handleGetData)
                        }
                      >
                        <Trash color={theme?.blue} />
                      </Pressable>
                    </VStack>
                  </HStack>
                </HStack>
              </VStack>
            </When>
          </VStack>
        ))}
      </VStack>
    </BackgroundContainer>
  );
};
