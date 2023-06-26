import { useNavigation } from "@react-navigation/native";
import { HStack, Pressable, Text, VStack } from "native-base";
import { BackgroundContainer } from "../../../../styles/general";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";

const actions = [
  {
    label: "Informações Pessoais",
    url: "Configuracoes/DadosCadastrais/InformacoesCadastrais",
  },
  {
    label: "Alterar senha",
    url: "Configuracoes/DadosCadastrais/AlterarSenha",
  },
];

export const DadosCadastraisScreen = () => {
  const { theme }: IThemeProvider = useTheme();
  const { goBack, navigate } = useNavigation();

  function goTo(url: string) {
    navigate(url as never);
  }

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
          <Text fontWeight={700}>Dados Cadastrais</Text>
        </HStack>
        {actions.map((action, index) => (
          <Pressable key={index} onPress={() => goTo(action.url)}>
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
