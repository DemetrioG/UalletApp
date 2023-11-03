import { Button, HStack, Pressable, Text, VStack } from "native-base";
import { BackgroundContainer } from "../../../../styles/general";
import { useNavigation } from "@react-navigation/native";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { STRIPE_CUSTOMER_PORTAL } from "@env";
import { usePlans } from "./hooks/usePlan";
import { convertDateFromDatabase } from "../../../../utils/date.helper";

export const Plan = () => {
  const { goBack } = useNavigation();
  const { theme }: IThemeProvider = useTheme();
  const { isLoading, plans } = usePlans();

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
        {plans.map((plan, i) => {
          const isActive = plan?.status === "active";
          const isFree = plan?.items[0]?.price?.product?.name.includes("free");
          return (
            <VStack
              key={i}
              backgroundColor={theme?.primary}
              p={5}
              space={6}
              borderRadius="20px"
            >
              <HStack justifyContent="space-between">
                <Text fontWeight={600}>
                  {plan?.items[0]?.price?.product?.name}
                </Text>
                <HStack alignItems="center" space={2}>
                  <VStack
                    borderRadius={50}
                    backgroundColor={isActive ? theme?.blue : theme?.red}
                    width="10px"
                    height="10px"
                  />
                  <Text>{isActive ? "Ativo" : "Inativo"}</Text>
                </HStack>
              </HStack>
              <VStack space={2}>
                <HStack justifyContent="space-between">
                  <Text>Valido até:</Text>
                  <Text>
                    {convertDateFromDatabase(plan?.current_period_end)}
                  </Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Valor:</Text>
                  <Text>
                    {(plan?.items[0]?.plan.amount / 100).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </Text>
                </HStack>
              </VStack>
              {!isFree && (
                <Button
                  variant="outline"
                  marginBottom={0}
                  onPress={() =>
                    WebBrowser.openBrowserAsync(
                      STRIPE_CUSTOMER_PORTAL.toString()
                    )
                  }
                >
                  <Text fontWeight={600} color={theme?.blue}>
                    Gerenciar plano
                  </Text>
                </Button>
              )}
            </VStack>
          );
        })}
      </VStack>
    </BackgroundContainer>
  );
};
