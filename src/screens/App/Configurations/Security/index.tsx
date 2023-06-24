import * as React from "react";
import { HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { BackgroundContainer } from "../../../../styles/general";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft, Trash } from "lucide-react-native";

const actions = [
  {
    label: "Excluir conta",
    icon: "trash",
    url: "Configuracoes/Seguranca/ExcluirConta",
  },
];

export const SecurityScreen = () => {
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { theme }: IThemeProvider = useTheme();

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
          <Text fontWeight={700}>Segurança</Text>
        </HStack>
        {actions.map((action, index) => (
          <Pressable key={index} onPress={() => navigate(action.url)}>
            <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
              <HStack justifyContent="space-between" alignItems={"center"}>
                <HStack alignItems="center" space={3}>
                  <Text>{action.label}</Text>
                </HStack>
                <Trash color={theme?.text} />
              </HStack>
            </VStack>
          </Pressable>
        ))}
      </VStack>
    </BackgroundContainer>
  );
};
