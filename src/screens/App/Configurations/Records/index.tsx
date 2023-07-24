import { HStack, Pressable, Text, VStack } from "native-base";
import { BackgroundContainer } from "../../../../styles/general";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const Records = () => {
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
          <Text fontWeight={700}>Cadastros</Text>
        </HStack>
        {actions.map((action, index) => (
          <Pressable key={index} onPress={() => navigate(action.url)}>
            <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
              <HStack justifyContent="space-between" alignItems={"center"}>
                <HStack alignItems="center" space={3}>
                  <Text>{action.label}</Text>
                </HStack>
                <ChevronRight color={theme?.text} />
              </HStack>
            </VStack>
          </Pressable>
        ))}
      </VStack>
    </BackgroundContainer>
  );
};

const actions = [
  {
    label: "Cadastro de Segmentos",
    url: "Configuracoes/Records/Segment",
  },
];
