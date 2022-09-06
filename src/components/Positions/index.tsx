import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Collapse, HStack, ScrollView, VStack } from "native-base";
import Toast from "react-native-toast-message";

import { IAsset, refreshAssetData } from "./query";
import Tooltip from "../Tooltip";
import Icon from "../Icon";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
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
import { colors, metrics } from "../../styles";
import { numberToReal } from "../../utils/number.helper";
import { getStorage } from "../../utils/storage.helper";
import { Skeleton } from "../../styles/general";
import { DataContext } from "../../context/Data/dataContext";

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

let counter = 0;
export const TotalOpen = ({
  label,
  value,
  percentual,
  withoutLabel,
}: {
  label?: "HOJE" | "TOTAL";
  value: string;
  percentual: string;
  withoutLabel?: boolean;
}) => {
  const isPercentualNegative = percentual.includes("-");
  return (
    <VStack pl={!withoutLabel ? 3 : 0} mb={2}>
      {!withoutLabel && <TotalLabel>{label}</TotalLabel>}
      <HStack alignItems="center">
        <Icon
          name={!isPercentualNegative ? "trending-up" : "trending-down"}
          size={16}
          colorVariant={!isPercentualNegative ? "green" : "red"}
        />
        <TotalValue ml={1}>{value}</TotalValue>
        <TotalPercentual ml={2} negative={isPercentualNegative}>
          ({percentual}%)
        </TotalPercentual>
      </HStack>
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
        name={!isPercentualNegative ? "trending-up" : "trending-down"}
        size={16}
        colorVariant={!isPercentualNegative ? "green" : "red"}
        style={{ marginLeft: 5 }}
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
  setSpinner,
}: {
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const {
    user: { hideAssetPosition },
    setUser,
  } = React.useContext(UserContext);
  const {
    loader: { investVisible },
    setLoader,
  } = React.useContext(LoaderContext);
  const { setData: setDataContext } = React.useContext(DataContext);
  const [data, setData] = React.useState<IAsset[]>([]);
  const [totalValue, setTotalValue] = React.useState(0);
  const [todayValue, setTodayValue] = React.useState(0);
  const [totalRent, setTotalRent] = React.useState("0,00");
  const [todayRent, setTodayRent] = React.useState("0,00");

  const headerScrollRef = React.useRef() as React.MutableRefObject<any>;

  const isFocused = useIsFocused();
  console.log(++counter);

  function handlePositionVisible() {
    setUser((userState) => ({
      ...userState,
      hideAssetPosition: !userState.hideAssetPosition,
    }));
  }

  async function refreshData() {
    refreshAssetData()
      .then(async () => {
        await getData();
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

    totalValue && setTotalValue(totalValue);
    totalRent && setTotalRent(totalRent);
    todayValue && setTodayValue(todayValue);
    todayRent && setTodayRent(todayRent);
    totalEquity &&
      setDataContext((state) => ({
        ...state,
        equity: totalEquity,
      }));
    data && setData(data);

    if (investVisible) {
      setLoader((state) => ({
        ...state,
        positions: true,
      }));
    }
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
        <Tooltip text="Seus ativos em Renda Variável">
          <Icon
            name="info"
            color={colors.gray}
            size={16}
            style={{ marginLeft: metrics.baseMargin }}
          />
        </Tooltip>
      </HStack>
      <Skeleton
        isLoaded={!investVisible}
        mt={4}
        h={hideAssetPosition ? 52 : 200}
      >
        <VStack mt={5} mb={!hideAssetPosition ? 0 : 10}>
          <Header>
            <TouchableOpacity onPress={handlePositionVisible}>
              <HStack justifyContent="space-between" alignItems="center">
                {hideAssetPosition ? (
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
                  name={!hideAssetPosition ? "chevron-down" : "chevron-right"}
                />
              </HStack>
            </TouchableOpacity>
          </Header>
          <Collapse isOpen={!hideAssetPosition}>
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
        </VStack>
      </Skeleton>
    </VStack>
  );
};

export default Positions;
