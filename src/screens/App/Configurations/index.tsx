import { useNavigation } from "@react-navigation/native";
import { HStack, Pressable, Text, VStack } from "native-base";
import { BackgroundContainer } from "../../../styles/general";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../styles/baseTheme";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  PlusCircle,
  Shield,
  User,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const ConfiguracoesScreen = () => {
  const { theme }: IThemeProvider = useTheme();
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<any>>();

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
          <Text fontWeight={700}>Configurações</Text>
        </HStack>
        {actions.map((action) => (
          <Pressable onPress={() => navigate(action.url)} key={action.url}>
            <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
              <HStack justifyContent="space-between" alignItems={"center"}>
                <HStack alignItems="center" space={3}>
                  <action.Icon color={theme?.blue} />
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
    label: "Dados Cadastrais",
    url: "Configuracoes/DadosCadastrais",
    Icon: User,
    color: "blue",
  },
  {
    label: "Segurança",
    url: "Configuracoes/Seguranca",
    Icon: Shield,
    color: "blue",
  },
  {
    label: "Cadastros",
    url: "Configuracoes/Records",
    Icon: PlusCircle,
    color: "blue",
  },
  {
    label: "Alertas",
    url: "Configuracoes/Alertas",
    Icon: Flag,
    color: "blue",
  },
];
