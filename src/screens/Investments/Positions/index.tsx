import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Collapse, HStack, ScrollView, VStack } from "native-base";

import { getAssets, getUpdatedInfos, IAsset } from "./query";
import Icon from "../../../components/Icon";
import { UserContext } from "../../../context/User/userContext";
import {
  Circle,
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
import { Skeleton } from "../../../styles/general";
import {
  getRentPercentual,
  numberToReal,
  realToNumber,
} from "../../../utils/number.helper";

const ITEMS_WIDTH = {
  asset: 78,
  price: 120,
  amount: 75,
  rentPercentual: 140,
  rent: 150,
  segment: 140,
  delete: 70,
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
}: {
  data: IAsset[];
  scrollRef: React.MutableRefObject<any>;
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
                  <ItemContent number withColor negative={e.rent.includes("-")}>
                    {e.rent}
                  </ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.price}>
                  <ItemContent number>{e.price}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.amount}>
                  <ItemContent number>{e.amount}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.pvp}>
                  <ItemContent number>{e.pvp}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.dy}>
                  <ItemContent number>{e.dy}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.pl}>
                  <ItemContent number>{e.pl}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.segment}>
                  <ItemContent number>{e.segment}</ItemContent>
                </ItemContainer>
                <ItemContainer minW={ITEMS_WIDTH.delete}>
                  <Circle>
                    <Icon name="minus" size={14} color={colors.white} />
                  </Circle>
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
  const { user, setUser } = React.useContext(UserContext);
  const [data, setData] = React.useState<IAsset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalValue, setTotalValue] = React.useState(0);
  const [totalRent, setTotalRent] = React.useState("");

  const headerScrollRef = React.useRef() as React.MutableRefObject<any>;

  const isFocused = useIsFocused();

  function handlePositionVisible() {
    setUser((userState) => ({
      ...userState,
      hideAssetPosition: !userState.hideAssetPosition,
    }));
  }

  React.useEffect(() => {
    async function getData() {
      await getAssets(user.uid!)
        .then((data) => {
          getUpdatedInfos(data)
            .then((infos) => {
              const finalData: IAsset[] = [];
              let totalValue = 0;
              let totalAtualPrice = 0;
              let totalMediumPrice = 0;
              infos.map((info) => {
                const [item] = data.filter((e) => e.asset === info.asset);
                const newData: IAsset = {
                  id: item.id,
                  amount: item.amount,
                  asset: item.asset,
                  price: item.price,
                  segment: item.segment,
                  atualPrice: info.atualPrice,
                  rent: info.rent,
                  rentPercentual: info.rentPercentual,
                  pvp: info.pvp,
                  dy: info.dy,
                  pl: info.pl,
                };

                totalValue += realToNumber(info.rent);
                totalAtualPrice += info.totalPrecoAtual;
                totalMediumPrice += info.totalPrecoMedio;

                return finalData.push(newData);
              });
              setTotalValue(totalValue);
              setTotalRent(
                getRentPercentual(totalMediumPrice, totalAtualPrice)
              );
              setData(finalData);
            })
            .finally(() => setLoading(false));
        })
        .catch(() => setLoading(false));
    }
    getData();
  }, [isFocused]);

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
        <Header>
          <TouchableOpacity onPress={handlePositionVisible}>
            <HStack justifyContent="space-between" alignItems="center">
              {!user.hideAssetPosition ? (
                <HStack>
                  <TotalClose label="HOJE" percentual="3,06%" />
                  <TotalClose label="TOTAL" percentual={totalRent} />
                </HStack>
              ) : (
                <VStack>
                  <TotalOpen label="HOJE" value="R$ 49,51" percentual="3,06%" />
                  <TotalOpen
                    label="TOTAL"
                    value={numberToReal(totalValue)}
                    percentual={totalRent}
                  />
                </VStack>
              )}
              <Icon
                name={user.hideAssetPosition ? "chevron-down" : "chevron-right"}
              />
            </HStack>
          </TouchableOpacity>
        </Header>
        <Collapse isOpen={user.hideAssetPosition}>
          <Container>
            <Skeleton isLoaded={!loading} secondary>
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
                        <ItemContainer minW={ITEMS_WIDTH.delete}>
                          <Label>EXCLUIR</Label>
                        </ItemContainer>
                      </HStack>
                    </ScrollView>
                  </HStack>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <ItemList data={data} scrollRef={headerScrollRef} />
                  </ScrollView>
                </>
              ) : (
                <EmptyText>Não há dados para visualizar</EmptyText>
              )}
            </Skeleton>
          </Container>
        </Collapse>
      </VStack>
    </VStack>
  );
};

export default Positions;
