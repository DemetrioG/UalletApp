import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, HStack, ScrollView, Text, VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Positions from "@components/Positions";
import { numberToReal } from "@utils/number.helper";
import {
  BackgroundContainer,
  Balance,
  ButtonText,
  TextHeaderScreen,
  ViewTab,
} from "@styles/general";
import { metrics } from "@styles/index";
import { LoaderContext } from "@context/Loader/loaderContext";
import { DataContext } from "@context/Data/dataContext";
import AssetSegmentChart from "./AssetSegmentChart";
import EvolutionLineChart from "./EvolutionLineChart";

const Investments = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const {
    loader: { positions, assetSegmentChart },
    setLoader,
  } = React.useContext(LoaderContext);
  const { data } = React.useContext(DataContext);

  React.useEffect(() => {
    if (positions && assetSegmentChart) {
      setLoader((state) => ({
        ...state,
        investVisible: false,
      }));
    }
  }, [positions, assetSegmentChart]);

  return (
    <BackgroundContainer>
      <ViewTab>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HStack mb={metrics.baseMargin} justifyContent={"space-between"}>
            <TextHeaderScreen noMarginBottom>Investimentos</TextHeaderScreen>
          </HStack>
          <Text fontSize={"lg"} fontWeight={700}>
            Patrimônio investido
          </Text>
          <VStack mt={1}>
            <Balance>{numberToReal(data.equity)}</Balance>
          </VStack>
          <VStack mt={5}>
            <Text fontSize={"md"}>Evolução da carteira</Text>
            <EvolutionLineChart />
          </VStack>
          <Positions />
          <VStack mt={5}>
            <Text fontSize={"md"}>Alocação por segmento</Text>
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
