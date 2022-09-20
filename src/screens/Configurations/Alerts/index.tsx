import * as React from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { HStack, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

import firebase from "../../../services/firebase";
import Icon from "../../../components/Icon";
import { ItemContainer, ItemText } from "../../../components/Menu/styles";
import {
  BackgroundContainer,
  ButtonIcon,
  TextHeaderScreen,
  ViewTab,
} from "../../../styles/general";
import { deleteData, getData } from "./query";

interface IData {
  variableExpense: number;
}

const AlertsScreen = () => {
  const { goBack, navigate } = useNavigation();
  const isFocused = useIsFocused();
  const [data, setData] = React.useState<
    IData | firebase.firestore.DocumentData
  >();
  const [loading, setLoading] = React.useState(false);

  const actions = [
    {
      label: "Despesas variáveis",
      url: "Configuracoes/Alertas/DespesasVariaveis",
      data: {
        index: "variableExpense",
        value: data?.variableExpense || 0,
      },
    },
  ];

  function goTo(url: string, params?: any) {
    navigate(url as never, params as never);
  }

  function returnData() {
    getData().then((data) => {
      setData(data);
    });
  }

  function handleDelete(index: string) {
    setLoading(true);
    deleteData(index)
      .then(() => {
        returnData();
        Toast.show({
          type: "success",
          text1: "Alerta excluído com sucesso",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao excluir alerta",
        });
      })
      .finally(() => setLoading(false));
  }

  React.useEffect(() => {
    isFocused && returnData();
  }, [isFocused]);

  return (
    <BackgroundContainer>
      <ViewTab>
        <HStack alignItems="center" space={3} mb={10}>
          <Icon name="chevron-left" size={24} onPress={goBack} />
          <TextHeaderScreen noMarginBottom>Alertas</TextHeaderScreen>
        </HStack>
        {actions.map((action, index) => (
          <VStack key={index}>
            {!action.data.value ? (
              <TouchableOpacity onPress={() => goTo(action.url)}>
                <ItemContainer>
                  <HStack
                    justifyContent="space-between"
                    flex={1}
                    alignItems={"center"}
                  >
                    <ItemText>{action.label}</ItemText>
                    <Icon name="plus-circle" size={20} />
                  </HStack>
                </ItemContainer>
              </TouchableOpacity>
            ) : (
              <ItemContainer>
                <HStack
                  justifyContent="space-between"
                  flex={1}
                  alignItems={"center"}
                >
                  <ItemText>{action.label}</ItemText>
                  <HStack>
                    <VStack>
                      <Icon
                        name="edit-3"
                        size={20}
                        onPress={() => goTo(action.url, action.data.value)}
                      />
                    </VStack>
                    <VStack>
                      <ButtonIcon
                        isLoading={loading}
                        icon={
                          <Icon name="trash" size={20} colorVariant="red" />
                        }
                        onPress={() => handleDelete(action.data.index)}
                      />
                    </VStack>
                  </HStack>
                </HStack>
              </ItemContainer>
            )}
          </VStack>
        ))}
      </ViewTab>
    </BackgroundContainer>
  );
};

export default AlertsScreen;
