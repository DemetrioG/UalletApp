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
import { PatrimonyText, Spinner } from "./styles";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";

const Investments = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const {
    loader: { positions, equity, investVisible },
    setLoader,
  } = React.useContext(LoaderContext);
  const { data } = React.useContext(DataContext);
  const [spinner, setSpinner] = React.useState(true);

  React.useEffect(() => {
    if (positions) {
      setLoader((state) => ({
        ...state,
        investVisible: false,
      }));
    }
  }, [positions]);

  return (
    <BackgroundContainer>
      <ViewTab>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HStack mb={metrics.baseMargin} justifyContent={"space-between"}>
            <TextHeaderScreen noMarginBottom>Investimentos</TextHeaderScreen>
            {spinner && <Spinner />}
          </HStack>
          <PatrimonyText>Patrimônio investido</PatrimonyText>
          <VStack mt={1}>
            <Balance>{numberToReal(data.equity)}</Balance>
          </VStack>
          <Positions setSpinner={setSpinner} />
          <Button mt={10} onPress={() => navigate("NovoAtivo")}>
            <ButtonText>ADICIONAR ATIVO</ButtonText>
          </Button>
        </ScrollView>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default Investments;
