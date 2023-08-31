import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../styles/baseTheme";
import { BackgroundContainer, BackgroundEffect } from "../../../styles/general";
import { Center, HStack, Skeleton, Text, VStack } from "native-base";
import { GooglePay } from "../../../components/Payments/GooglePay";
import { ApplePay } from "../../../components/Payments/ApplePay";
import { useGetPrice } from "./hooks/useCheckout";
import When from "../../../components/When";

export const Checkout = () => {
  const { theme }: IThemeProvider = useTheme();
  const { isLoading, data } = useGetPrice();

  return (
    <BackgroundContainer p="20px">
      <BackgroundEffect />
      <VStack space={5}>
        <VStack>
          <VStack
            paddingY={0.5}
            paddingX={2}
            borderRadius={15}
            backgroundColor={theme?.blue}
            alignSelf="flex-start"
          >
            <Text fontSize="36" fontWeight="700" color="white">
              Você
            </Text>
          </VStack>
          <Text fontSize="24" fontWeight="700" color="white">
            está a um passo de dominar suas finanças
          </Text>
          <Text mt={8} color="white">
            Seus dias grátis acabaram, mas isso não significa que você precise
            perder o controle das suas finanças.
          </Text>
        </VStack>
      </VStack>
      <Center flex={1}>
        <VStack
          backgroundColor={theme?.secondary}
          borderRadius={15}
          p={5}
          width="100%"
          space={5}
        >
          <Text fontWeight={600}>Plano premium 💰</Text>
          <HStack alignItems="center" space={2}>
            <When is={isLoading}>
              <Skeleton
                h="50px"
                width="155px"
                rounded="lg"
                startColor={theme?.primary}
              />
            </When>
            <When is={!isLoading}>
              <Text fontSize="46" fontWeight="bold">
                {data}
              </Text>
            </When>
            <VStack>
              <Text opacity={0.6}>por</Text>
              <Text opacity={0.6}>mês</Text>
            </VStack>
          </HStack>
          <VStack space={1}>
            <Text fontWeight={600}>Inclui:</Text>
            <Text>Lançamentos recorrentes</Text>
            <Text>Consolidação de lançamentos</Text>
            <Text>Segmentação de lançamentos</Text>
            <Text>Suporte ao cliente</Text>
            <Text>Dashboard financeiro</Text>
            <Text>Notificações personalizadas</Text>
          </VStack>
        </VStack>
      </Center>
      <VStack justifyContent="flex-end" pb={3}>
        <GooglePay />
        <ApplePay />
      </VStack>
    </BackgroundContainer>
  );
};
