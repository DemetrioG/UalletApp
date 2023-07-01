import { useState } from "react";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import {
  BackgroundContainer,
  ButtonText,
  Slider,
} from "../../../../../styles/general";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { ChevronLeft } from "lucide-react-native";
import { useSubmit } from "./hooks/useVariableEntry";

export const VariableEntryScreen = ({
  route: { params },
}: {
  route: { params: number };
}) => {
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { isLoading, handleSubmit } = useSubmit();

  const [value, setValue] = useState(params ?? 50);

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
        <HStack paddingX={2} justifyContent="space-around">
          <Text w="70%">
            Quando suas despesas variáveis ultrapassarem{"\n"}de sua receita
            mensal enviaremos um alerta para você!
          </Text>
          <Text fontWeight={700} fontSize={40} color={theme?.blue}>
            {value}%
          </Text>
        </HStack>
        <Center flex={1}>
          <VStack w={"full"}>
            <Slider
              minimumValue={5}
              maximumValue={100}
              value={value}
              onSlidingComplete={(value) => setValue(Number(value.toFixed(0)))}
              tapToSeek
              step={5}
            />
          </VStack>
        </Center>
        <Button
          mt={65}
          isLoading={isLoading}
          onPress={() => handleSubmit(value)}
        >
          <Text fontWeight="bold" color="white">
            Confirmar
          </Text>
        </Button>
      </VStack>
    </BackgroundContainer>
  );
};
