import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, HStack, ScrollView, VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Positions from "./Positions";
import { numberToReal } from "../../utils/number.helper";
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
  const [totalEquity, setTotalEquity] = React.useState(0);

  return (
    <BackgroundContainer>
      <ViewTab>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HStack mb={metrics.baseMargin}>
            <TextHeaderScreen>Investimentos</TextHeaderScreen>
          </HStack>
          <PatrimonyText>Patrimônio investido</PatrimonyText>
          <VStack mt={1}>
            <Balance>{numberToReal(totalEquity)}</Balance>
          </VStack>
          <Positions setTotalEquity={setTotalEquity} />
          <Button mt={10} onPress={() => navigate("NovoAtivo")}>
            <ButtonText>ADICIONAR ATIVO</ButtonText>
          </Button>
        </ScrollView>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default Investments;
