import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, HStack, ScrollView, VStack } from "native-base";
import Positions from "./Positions";
import {
  BackgroundContainer,
  Balance,
  ButtonText,
  TextHeaderScreen,
  ViewTab,
} from "../../styles/general";
import { metrics } from "../../styles";
import { PatrimonyText } from "./styles";

const Investments = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <BackgroundContainer>
      <ViewTab>
        <ScrollView>
          <HStack mb={metrics.baseMargin}>
            <TextHeaderScreen>Investimentos</TextHeaderScreen>
          </HStack>
          <PatrimonyText>Patrimônio investido</PatrimonyText>
          <VStack mt={1}>
            <Balance>R$0,00</Balance>
          </VStack>
          <Positions />
          <Button mt={10} onPress={() => navigate("NovoAtivo")}>
            <ButtonText>ADICIONAR ATIVO</ButtonText>
          </Button>
        </ScrollView>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default Investments;
