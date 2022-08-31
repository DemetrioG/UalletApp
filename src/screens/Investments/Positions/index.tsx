import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Collapse, HStack, ScrollView, VStack } from "native-base";
import Toast from "react-native-toast-message";

import { getAssets, getUpdatedInfos, IAsset } from "./query";
import Icon from "../../../components/Icon";
import { UserContext } from "../../../context/User/userContext";
import {
  Container,
  EmptyText,
  Header,
  HeaderText,
  ItemContainer,
  ItemContent,
  Label,
  TotalLabel,
  TotalPercentual,
  TotalValue,
} from "./styles";
import { colors, metrics } from "../../../styles";
import { getRentPercentual, numberToReal } from "../../../utils/number.helper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getStorage, setStorage } from "../../../utils/storage.helper";
import { LoaderContext } from "../../../context/Loader/loaderContext";
import { Skeleton } from "../../../styles/general";

const ITEMS_WIDTH = {
  asset: 78,
  price: 120,
  amount: 75,
  rentPercentual: 140,
  rent: 150,
  segment: 140,
  info: 70,
  pvp: 75,
  dy: 100,
  pl: 75,
};

const TotalOpen = ({
  label,
  value,
  percentual,
}: {
  label: "HOJE" | "TOTAL";
  value: string;
  percentual: string;
}) => {
  const isPercentualNegative = percentual.includes("-");
  return (
    <VStack pl={3} mb={2}>
      <VStack>
        <TotalLabel>{label}</TotalLabel>
        <HStack alignItems="center">
          <Icon
            name={!isPercentualNegative ? "arrow-up" : "arrow-down"}
            size={16}
            colorVariant={!isPercentualNegative ? "green" : "red"}
          />
          <TotalValue ml={1}>{value}</TotalValue>
          <TotalPercentual ml={2} negative={isPercentualNegative}>
            {percentual}%
          </TotalPercentual>
        </HStack>
      </VStack>
    </VStack>
  );
};

const TotalClose = ({
  label,
  percentual,
}: {
  label: "HOJE" | "TOTAL";
  percentual: string;
}) => {
  const isPercentualNegative = percentual.includes("-");
  return (
    <HStack alignItems="center" mr={3}>
      <TotalLabel>{label}</TotalLabel>
      <Icon
        name={!isPercentualNegative ? "arrow-up" : "arrow-down"}
        size={16}
        colorVariant={!isPercentualNegative ? "green" : "red"}
      />
      <TotalPercentual ml={2} negative={isPercentualNegative}>
        {percentual}%
      </TotalPercentual>
    </HStack>
  );
};

const ItemList = ({
  data,
  scrollRef,
  navigation,
}: {
  data: IAsset[];
  scrollRef: React.MutableRefObject<any>;
  navigation: Function;
}) => {
  return (
    <HStack>
      <View>
        {data.map((e, i) => {
          return (
            <ItemContainer key={i} minW={ITEMS_WIDTH.asset}>
              <ItemContent number>{e.asset}</ItemContent>
            </ItemContainer>
          );
        })}
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollRef.current.scrollTo({
            x: e.nativeEvent.contentOffset.x,
            y: e.nativeEvent.contentOffset.y,
            animated: false,
          });
        }}
      >
        <View>
          {data.map((e, i) => {
            return (
              <HStack key={i}>
                <ItemContainer minW={ITEMS_WIDTH.price}>
                  <ItemContent number>{e.atualPrice}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.rentPercentual}>
                  <ItemContent
                    number
                    withColor
                    negative={e.rentPercentual.includes("-")}
                  >
                    {e.rentPercentual}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.rent}>
                  <ItemContent
                    number
                    withColor
                    negative={numberToReal(e.rent).includes("-")}
                  >
                    {numberToReal(e.rent)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.price}>
                  <ItemContent number>
                    {numberToReal(e.price, true)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.amount}>
                  <ItemContent number>{e.amount}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.amount}>
                  <ItemContent number>
                    {numberToReal(e.total || 0, true)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.pvp}>
                  <ItemContent number>{e.pvp}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.dy}>
                  <ItemContent number>{e.dy}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.pl}>
                  <ItemContent number>{e.pl || "-"}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.segment}>
                  <ItemContent number>{e.segment}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.info}>
                  <Icon
                    name="more-horizontal"
                    onPress={() => navigation("Investimentos/AtivoInfo", e)}
                  />
                </ItemContainer>
              </HStack>
            );
          })}
        </View>
      </ScrollView>
    </HStack>
  );
};

const Positions = ({
  setTotalEquity,
  setSpinner,
}: {
  setTotalEquity: React.Dispatch<React.SetStateAction<number>>;
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const {
    loader: { investVisible },
    setLoader,
  } = React.useContext(LoaderContext);
  const [data, setData] = React.useState<IAsset[]>([]);
  const [totalValue, setTotalValue] = React.useState(0);
  const [todayValue, setTodayValue] = React.useState(0);
  const [totalRent, setTotalRent] = React.useState("0,00");
  const [todayRent, setTodayRent] = React.useState("0,00");

  const headerScrollRef = React.useRef() as React.MutableRefObject<any>;

  const isFocused = useIsFocused();

  function handlePositionVisible() {
    setUser((userState) => ({
      ...userState,
      hideAssetPosition: !userState.hideAssetPosition,
    }));
  }

  async function refreshData() {
    await getAssets(user.uid!)
      .then(async (data) => {
        await getUpdatedInfos(data).then(async (infos) => {
          const finalData: IAsset[] = [];
          let totalValue = 0;
          let totalInitialPrice = 0;
          let totalMediumPrice = 0;
          let totalAtualPrice = 0;

          infos.map((info) => {
            const [item] = data.filter((e) => e.asset === info.asset);
            const newData: IAsset = {
              id: item.id,
              amount: item.amount,
              asset: item.asset,
              price: item.price,
              segment: item.segment,
              total: info.totalPrecoAtual,
              atualPrice: info.atualPrice,
              rent: info.rent,
              rentPercentual: info.rentPercentual,
              pvp: info.pvp,
              dy: info.dy,
              pl: info.pl,
            };

            totalValue += info.rent;
            totalAtualPrice += info.totalPrecoAtual;
            totalMediumPrice += info.totalPrecoMedio;
            totalInitialPrice += info.totalPrecoInicial;

            return finalData.push(newData);
          });

          setStorage("investPositionsTotalValue", totalValue);
          setStorage(
            "investPositionsTotalRent",
            getRentPercentual(totalMediumPrice, totalAtualPrice)
          );
          setStorage(
            "investPositionsTodayValue",
            totalAtualPrice - totalInitialPrice
          );
          setStorage(
            "investPositionsTodayRent",
            getRentPercentual(totalInitialPrice, totalAtualPrice)
          );
          setStorage("investTotalEquity", totalAtualPrice);
          setStorage("investPositionsData", finalData);

          await getData();
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao atualizar as posições",
        });
      })
      .finally(() => setSpinner(false));
  }

  async function getData() {
    const totalValue = await getStorage("investPositionsTotalValue");
    const totalRent = await getStorage("investPositionsTotalRent");
    const todayValue = await getStorage("investPositionsTodayValue");
    const todayRent = await getStorage("investPositionsTodayRent");
    const totalEquity = await getStorage("investTotalEquity");
    const data = await getStorage("investPositionsData");

    setTotalValue(totalValue);
    setTotalRent(totalRent);
    setTodayValue(todayValue);
    setTodayRent(todayRent);
    setTotalEquity(totalEquity);
    setData(data);

    setLoader((state) => ({
      ...state,
      equity: true,
      positions: true,
    }));
  }

  React.useEffect(() => {
    isFocused && refreshData();
  }, [isFocused]);

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <VStack mt={5}>
      <HStack alignItems="center">
        <HeaderText>Posições RV</HeaderText>
        <Icon
          name="info"
          color={colors.gray}
          size={16}
          style={{ marginLeft: metrics.baseMargin }}
        />
      </HStack>
      <VStack mt={5} mb={user.hideAssetPosition ? 0 : 10}>
        <Skeleton isLoaded={!investVisible} h={200}>
          <Header>
            <TouchableOpacity onPress={handlePositionVisible}>
              <HStack justifyContent="space-between" alignItems="center">
                {!user.hideAssetPosition ? (
                  <HStack>
                    <TotalClose label="HOJE" percentual={todayRent} />
                    <TotalClose label="TOTAL" percentual={totalRent} />
                  </HStack>
                ) : (
                  <VStack>
                    <TotalOpen
                      label="HOJE"
                      value={numberToReal(todayValue)}
                      percentual={todayRent}
                    />
                    <TotalOpen
                      label="TOTAL"
                      value={numberToReal(totalValue)}
                      percentual={totalRent}
                    />
                  </VStack>
                )}
                <Icon
                  name={
                    user.hideAssetPosition ? "chevron-down" : "chevron-right"
                  }
                />
              </HStack>
            </TouchableOpacity>
          </Header>
          <Collapse isOpen={user.hideAssetPosition}>
            <Container>
              {data.length > 0 ? (
                <>
                  <HStack>
                    <ItemContainer minW={ITEMS_WIDTH.asset}>
                      <Label>TICKER</Label>
                    </ItemContainer>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      scrollEnabled={false}
                      ref={headerScrollRef}
                    >
                      <HStack>
                        <ItemContainer minW={ITEMS_WIDTH.price}>
                          <Label>PREÇO ATUAL</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.rentPercentual}>
                          <Label>RENTABILIDADE %</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.rent}>
                          <Label>RENTABILIDADE</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.price}>
                          <Label>PREÇO MÉDIO</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.amount}>
                          <Label>COTAS</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.amount}>
                          <Label>TOTAL</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.pvp}>
                          <Label>P/VP</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.dy}>
                          <Label>DY</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.pl}>
                          <Label>P/L</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.segment}>
                          <Label>SEGMENTO</Label>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.info}>
                          <Label>INFO</Label>
                        </ItemContainer>
                      </HStack>
                    </ScrollView>
                  </HStack>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <ItemList
                      data={data}
                      scrollRef={headerScrollRef}
                      navigation={navigate}
                    />
                  </ScrollView>
                </>
              ) : (
                <EmptyText>Não há dados para visualizar</EmptyText>
              )}
            </Container>
          </Collapse>
        </Skeleton>
      </VStack>
    </VStack>
  );
};

export default Positions;
