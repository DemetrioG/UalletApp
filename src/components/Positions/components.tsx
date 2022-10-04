import { HStack, ScrollView, VStack } from "native-base";
import React from "react";
import { View } from "react-native";
import { IPosition } from ".";
import { numberToReal } from "../../utils/number.helper";
import Icon from "../Icon";
import {
  ItemContainer,
  ItemContent,
  TotalLabel,
  TotalPercentual,
  TotalValue,
} from "./styles";

export const ITEMS_WIDTH = {
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

export const TotalClose = ({
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

export const ItemList = ({
  data,
  scrollRef,
  navigation,
}: {
  data: IPosition[];
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
