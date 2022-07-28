import { useNavigation } from "@react-navigation/native";
import { HStack } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "../../../components/Icon";
import { ItemContainer, ItemText } from "../../../components/Menu/styles";
import { fonts } from "../../../styles";
import { BackgroundContainer, TextHeader, ViewTab } from "../../../styles/general";

const actions = [
  {label: "Informações Pessoais", url: "Configuracoes/DadosCadastrais/InformacoesCadastrais"},
  {label: "Alterar senha", url: ""},
]

export const DadosCadastraisScreen = () => {
  const { goBack, navigate } = useNavigation();

  function goTo (url: string) {
    //TODO: tipagem de rota
    navigate(url as any);
  };

  return (
    <BackgroundContainer>
      <ViewTab>
        <HStack alignItems="center" space={3} mb={10}>
            <Icon name="chevron-left" size={24} onPress={goBack}/>
            <TextHeader fontSize={fonts.larger}>Dados Cadastrais</TextHeader>
        </HStack>
        {
          actions.map((action) => (
            <TouchableOpacity onPress={() => goTo(action.url)}>
              <ItemContainer>
                <HStack justifyContent="space-between" flex={1}>
                    <ItemText>{action.label}</ItemText>
                  <Icon name="chevron-right" size={18} />
                </HStack>
              </ItemContainer>
          </TouchableOpacity>
          ))
        }
      </ViewTab>
    </BackgroundContainer>
  )
};