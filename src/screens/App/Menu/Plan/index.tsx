import { Button, HStack, Pressable, Text, VStack } from "native-base";
import { BackgroundContainer } from "../../../../styles/general";
import { useNavigation } from "@react-navigation/native";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";

export const Plan = () => {
  const { goBack } = useNavigation();
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
          <Text fontWeight={700}>Meu plano</Text>
        </HStack>
        <VStack
          backgroundColor={theme?.primary}
          p={5}
          space={6}
          borderRadius="20px"
        >
          <HStack justifyContent="space-between">
            <Text fontWeight={600}>Premium</Text>
            <HStack alignItems="center" space={2}>
              <VStack
                borderRadius={50}
                backgroundColor={theme?.blue}
                width="10px"
                height="10px"
              />
              <Text>Ativo</Text>
            </HStack>
          </HStack>
          <VStack space={2}>
            <HStack justifyContent="space-between">
              <Text>Próxima cobrança:</Text>
              <Text>03/09/2023</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Valor:</Text>
              <Text>R$ 9,90</Text>
            </HStack>
          </VStack>
          <Button variant="outline" marginBottom={0}>
            <Text fontWeight={600} color={theme?.blue}>
              Gerenciar plano
            </Text>
          </Button>
        </VStack>
      </VStack>
    </BackgroundContainer>
  );
};
