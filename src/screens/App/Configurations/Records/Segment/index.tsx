import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { BackgroundContainer } from "../../../../../styles/general";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useListSegments } from "./hooks/useSegment";
import { useEffect } from "react";
import When from "../../../../../components/When";
import Tooltip from "../../../../../components/Tooltip";
import { InfoIcon } from "lucide-react-native";

export const Segment = () => {
  const { theme }: IThemeProvider = useTheme();
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { data, isLoading, handleExecute } = useListSegments();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && handleExecute();
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
        <VStack flex={1}>
          <HStack alignItems="center" justifyContent="space-between" mb={10}>
            <HStack alignItems="center" space={3}>
              <Pressable onPress={goBack}>
                <ChevronLeft color={theme?.text} />
              </Pressable>
              <Text fontWeight={700}>Cadastro de Segmentos</Text>
            </HStack>
            <Pressable>
              <Tooltip label="Você pode ter até 5 segmentos cadastrados">
                <InfoIcon color={theme?.text} />
              </Tooltip>
            </Pressable>
          </HStack>
          <When is={!!data.length}>
            <>
              {data.map((_) => (
                <Pressable
                  onPress={() =>
                    navigate("Configuracoes/Records/Segment/Form", _)
                  }
                  key={_.id}
                >
                  <VStack
                    borderBottomWidth={1}
                    borderColor={theme?.primary}
                    p={4}
                  >
                    <HStack
                      justifyContent="space-between"
                      alignItems={"center"}
                    >
                      <HStack alignItems="center" space={3}>
                        <Text>{_.description}</Text>
                      </HStack>
                      <ChevronRight color={theme?.text} />
                    </HStack>
                  </VStack>
                </Pressable>
              ))}
            </>
          </When>
          <When is={!data.length}>
            <Center flex={1}>
              <Text>Nenhum segmento cadastrado</Text>
            </Center>
          </When>
        </VStack>
        <Button
          isDisabled={data.length > 4}
          onPress={() => navigate("Configuracoes/Records/Segment/Form")}
        >
          <Text fontWeight="bold" color="white">
            Novo
          </Text>
        </Button>
      </VStack>
    </BackgroundContainer>
  );
};
