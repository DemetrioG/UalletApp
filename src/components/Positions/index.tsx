import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Collapse, HStack, ScrollView, VStack } from "native-base";

import firebase from "../../services/firebase";
import { IAsset, ITotal, refreshAssetData } from "./query";
import Tooltip from "../Tooltip";
import Icon from "../Icon";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import {
  Container,
  EmptyText,
  Header,
  ItemContainer,
  ItemContent,
  Label,
  TotalLabel,
  TotalPercentual,
  TotalValue,
} from "./styles";
import { colors, metrics } from "../../styles";
import { numberToReal } from "../../utils/number.helper";
import { Skeleton } from "../../styles/general";
import { DataContext } from "../../context/Data/dataContext";
import { Title } from "../../screens/Investments/styles";
import { currentUser } from "../../utils/query.helper";

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

export const TotalOpen = ({
  label,
  value,
  percentual,
  withoutLabel,
}: {
  label?: "HOJE" | "TOTAL";
  value: string;
  percentual: number;
  withoutLabel?: boolean;
}) => {
  const formattedPercentual = numberToReal(percentual, true);
  const isPercentualNegative = formattedPercentual.includes("-");
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
          ({formattedPercentual}%)
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
  percentual: number;
}) => {
  const formattedPercentual = numberToReal(percentual, true);
  const isPercentualNegative = formattedPercentual.includes("-");
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
        {formattedPercentual}%
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
                  <ItemContent number>
                    {numberToReal(e.atualPrice || 0, true)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.rentPercentual}>
                  <ItemContent
                    number
                    withColor
                    negative={numberToReal(e.rentPercentual || 0).includes("-")}
                  >
                    {numberToReal(e.rentPercentual || 0, true) + "%"}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.rent}>
                  <ItemContent
                    number
                    withColor
                    negative={numberToReal(e.rent || 0).includes("-")}
                  >
                    {numberToReal(e.rent || 0)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.price}>
                  <ItemContent number>
                    {numberToReal(e.price || 0, true)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.amount}>
                  <ItemContent number>{e.amount}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.amount}>
                  <ItemContent number>
                    {numberToReal(e.totalAtual || 0, true)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.pvp}>
                  <ItemContent number>
                    {numberToReal(e.pvp || 0, true)}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.dy}>
                  <ItemContent number>
                    {numberToReal(e.dy || 0, true) + "%"}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.pl}>
                  <ItemContent number>
                    {numberToReal(e.pl || 0, true) || "-"}
                  </ItemContent>
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

const Positions = () => {
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
  const [totalData, setTotalData] = React.useState<ITotal | null>(null);
  const totalValue = totalData?.totalValue || 0;
  const todayValue = totalData?.todayValue || 0;
  const totalRent = totalData?.totalRent || 0;
  const todayRent = totalData?.todayRent || 0;

  const headerScrollRef = React.useRef() as React.MutableRefObject<any>;

  const isFocused = useIsFocused();

  function handlePositionVisible() {
    setUser((userState) => ({
      ...userState,
      hideAssetPosition: !userState.hideAssetPosition,
    }));
  }

  async function getAssets() {
    const user = await currentUser();

    if (!user) return Promise.reject();

    firebase
      .firestore()
      .collection("assets")
      .doc(user.uid)
      .collection("variable")
      .orderBy("segment")
      .onSnapshot(
        (v) => {
          const assetsData: IAsset[] | firebase.firestore.DocumentData = [];
          v.forEach((result) => {
            assetsData.push(result.data());
          });
          setData(assetsData as IAsset[]);
        },
        () => Promise.reject()
      );

    firebase
      .firestore()
      .collection("equity")
      .doc(user.uid)
      .onSnapshot(
        (v) => {
          const data = v.data() as ITotal;
          setTotalData(data);
          setDataContext((state) => ({
            ...state,
            equity: data.equity,
          }));
        },
        () => Promise.reject()
      );
  }

  React.useEffect(() => {
    isFocused && refreshAssetData();
  }, [isFocused]);

  React.useEffect(() => {
    getAssets().finally(() => {
      investVisible &&
        setLoader((state) => ({
          ...state,
          positions: true,
        }));
    });
  }, []);

  return (
    <VStack mt={5}>
      <HStack alignItems="center">
        <Title>Posições RV</Title>
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
        <VStack mt={5} mb={!hideAssetPosition ? 0 : 53}>
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
