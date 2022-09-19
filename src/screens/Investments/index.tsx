import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, HStack, ScrollView, VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Positions from "../../components/Positions";
import { numberToReal } from "../../utils/number.helper";
import {
  BackgroundContainer,
  Balance,
  ButtonText,
  TextHeaderScreen,
  ViewTab,
} from "../../styles/general";
import { metrics } from "../../styles";
import { PatrimonyText, Spinner, Title } from "./styles";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import AssetSegmentChart from "./AssetSegmentChart";

const Investments = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const {
    loader: { positions },
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
          <VStack mt={5}>
            <Title>Alocação por segmento</Title>
            <VStack mt={5}>
              <AssetSegmentChart />
            </VStack>
          </VStack>
          <Button mt={10} onPress={() => navigate("Investimentos/NovoAtivo")}>
            <ButtonText>ADICIONAR ATIVO</ButtonText>
          </Button>
        </ScrollView>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default Investments;
