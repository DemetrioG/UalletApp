import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, HStack, Text, VStack } from "native-base";
import * as React from "react";
import { metrics } from "../../styles";
import {
  BackgroundContainer,
  Balance,
  ButtonText,
  TextHeaderScreen,
  ViewTab,
  ViewTabContent,
} from "../../styles/general";
import { PatrimonyText } from "./styles";

const Investments = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <BackgroundContainer>
      <ViewTab>
        <ViewTabContent>
          <HStack mb={metrics.baseMargin}>
            <TextHeaderScreen>Investimentos</TextHeaderScreen>
          </HStack>
          <PatrimonyText>Patrimônio investido</PatrimonyText>
          <VStack mt={1}>
            <Balance>R$0,00</Balance>
          </VStack>
          <Button mt={10} onPress={() => navigate("NovoAtivo")}>
            <ButtonText>ADICIONAR ATIVO</ButtonText>
          </Button>
        </ViewTabContent>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default Investments;
