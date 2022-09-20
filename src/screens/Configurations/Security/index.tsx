import * as React from "react";
import { HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

import Icon from "../../../components/Icon";
import { ItemContainer, ItemText } from "../../../components/Menu/styles";
import {
  BackgroundContainer,
  TextHeaderScreen,
  ViewTab,
} from "../../../styles/general";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const actions = [
  {
    label: "Excluir conta",
    icon: "trash",
    color: "red",
  },
];

const SecurityScreen = () => {
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <BackgroundContainer>
      <ViewTab>
        <HStack alignItems="center" space={3} mb={10}>
          <Icon name="chevron-left" size={24} onPress={goBack} />
          <TextHeaderScreen noMarginBottom>Segurança</TextHeaderScreen>
        </HStack>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigate("Configuracoes/Seguranca/ExcluirConta")}
          >
            <ItemContainer>
              <HStack
                justifyContent="space-between"
                flex={1}
                alignItems={"center"}
              >
                <ItemText>{action.label}</ItemText>
                <Icon
                  name={action.icon}
                  size={18}
                  colorVariant={action.color}
                />
              </HStack>
            </ItemContainer>
          </TouchableOpacity>
        ))}
      </ViewTab>
    </BackgroundContainer>
  );
};

export default SecurityScreen;
