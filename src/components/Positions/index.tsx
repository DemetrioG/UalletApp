import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Collapse, HStack, ScrollView, Text, VStack } from "native-base";

import firebase from "@services/firebase";
import { getPrice, ITotal } from "./query";
import Tooltip from "../Tooltip";
import Icon from "../Icon";
import { UserContext } from "../../context/User/userContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { Container, EmptyText, Header, ItemContainer } from "./styles";
import { colors, metrics } from "../../styles";
import { numberToReal } from "@utils/number.helper";
import { Skeleton } from "../../styles/general";
import { DataContext } from "../../context/Data/dataContext";
import { currentUser } from "@utils/query.helper";
import { ItemList, ITEMS_WIDTH, TotalClose, TotalOpen } from "./components";
import { IVariableIncome } from "../../types/assets";

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
      .onSnapshot(
        async (v) => {
          const assets = await firebase
            .firestore()
            .collection("assets")
            .doc(user.uid)
            .collection("variable")
            .orderBy("segment")
            .get()
            .then((v) => {
              const data: IVariableIncome[] = [];
              v.forEach((result) => {
                data.push(result.data() as IVariableIncome);
              });
              return data;
            });

          const assetsData: IPosition[] | firebase.firestore.DocumentData = [];
          for (const asset of assets) {
            const { atualPrice, dy, pl, pvp } = await getPrice(asset.asset);
            const data = {
              ...asset,
              atualPrice,
              dy,
              pl,
              pvp,
            };
            assetsData.push(data);
          }
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
        <Text fontSize={"md"}>Posições RV</Text>
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
                      <Text fontWeight={700}>TICKER</Text>
                    </ItemContainer>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      scrollEnabled={false}
                      ref={headerScrollRef}
                    >
                      <HStack>
                        <ItemContainer minW={ITEMS_WIDTH.price}>
                          <Text fontWeight={700}>PREÇO ATUAL</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.rentPercentual}>
                          <Text fontWeight={700}>RENTABILIDADE %</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.rent}>
                          <Text fontWeight={700}>RENTABILIDADE</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.price}>
                          <Text fontWeight={700}>PREÇO MÉDIO</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.amount}>
                          <Text fontWeight={700}>COTAS</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.amount}>
                          <Text fontWeight={700}>TOTAL</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.pvp}>
                          <Text fontWeight={700}>P/VP</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.dy}>
                          <Text fontWeight={700}>DY</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.pl}>
                          <Text fontWeight={700}>P/L</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.segment}>
                          <Text fontWeight={700}>SEGMENTO</Text>
                        </ItemContainer>
                        <ItemContainer minW={ITEMS_WIDTH.info}>
                          <Text fontWeight={700}>INFO</Text>
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
