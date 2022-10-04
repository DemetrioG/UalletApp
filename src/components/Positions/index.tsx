import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Collapse, HStack, ScrollView, VStack } from "native-base";

import firebase from "../../services/firebase";
import { getPrice, ITotal, refreshAssetData } from "./query";
import Tooltip from "../Tooltip";
import Icon from "../Icon";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { Container, EmptyText, Header, ItemContainer, Label } from "./styles";
import { colors, metrics } from "../../styles";
import { numberToReal } from "../../utils/number.helper";
import { Skeleton } from "../../styles/general";
import { DataContext } from "../../context/Data/dataContext";
import { Title } from "../../screens/Investments/styles";
import { currentUser } from "../../utils/query.helper";
import { ItemList, ITEMS_WIDTH, TotalClose, TotalOpen } from "./components";

export interface IPosition {
  id: number;
  asset: string;
  price: number;
  amount: number;
  segment: string;
  atualPrice: number;
  rentPercentual: number;
  rent: number;
  total: number;
  totalAtual: number;
  dy: number;
  pvp: number;
  pl: number;
}

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
  const [data, setData] = React.useState<IPosition[]>([]);
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
          const assetsData: IPosition[] | firebase.firestore.DocumentData = [];
          v.forEach(async (result) => {
            const { atualPrice, dy, pl, pvp } = await getPrice(
              result.data().asset
            );
            const data = {
              ...result.data(),
              atualPrice,
              dy,
              pl,
              pvp,
            };
            assetsData.push(data);
          });

          setData(assetsData as IPosition[]);
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
