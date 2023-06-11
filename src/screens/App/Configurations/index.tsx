import { useNavigation } from "@react-navigation/native";
import { HStack } from "native-base";
import { TouchableOpacity } from "react-native";
import Icon from "../../../components/Icon";
import { ItemContainer, ItemText } from "../../../components/Menu/styles";
import {
  BackgroundContainer,
  TextHeaderScreen,
  ViewTab,
} from "@styles/general";

const actions = [
  {
    label: "Dados Cadastrais",
    url: "Configuracoes/DadosCadastrais",
    icon: "user",
    color: "blue",
  },
  {
    label: "Segurança",
    url: "Configuracoes/Seguranca",
    icon: "shield",
    color: "blue",
  },
  {
    label: "Alertas",
    url: "Configuracoes/Alertas",
    icon: "flag",
    color: "blue",
  },
];

const ConfiguracoesScreen = () => {
  const { goBack, navigate } = useNavigation();

  function goTo(url: string) {
    //TODO: tipagem de rota
    navigate(url as any);
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <HStack alignItems="center" space={3} mb={10}>
          <Icon name="chevron-left" size={24} onPress={goBack} />
          <TextHeaderScreen noMarginBottom>Configurações</TextHeaderScreen>
        </HStack>
        {actions.map((action) => (
          <TouchableOpacity onPress={() => goTo(action.url)} key={action.url}>
            <ItemContainer>
              <HStack
                justifyContent="space-between"
                flex={1}
                alignItems={"center"}
              >
                <HStack alignItems="center" space={3}>
                  <Icon
                    colorVariant={action.color}
                    name={action.icon}
                    size={24}
                  />
                  <ItemText>{action.label}</ItemText>
                </HStack>
                <Icon name="chevron-right" size={18} />
              </HStack>
            </ItemContainer>
          </TouchableOpacity>
        ))}
      </ViewTab>
    </BackgroundContainer>
  );
};

export default ConfiguracoesScreen;
