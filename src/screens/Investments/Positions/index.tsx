import React, { useState } from "react";
import { Collapse, HStack, ScrollView, VStack } from "native-base";
import {
  Circle,
  Container,
  Header,
  HeaderText,
  ItemContainer,
  ItemContent,
  Label,
} from "./styles";
import Icon from "../../../components/Icon";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../../../styles";

const items = [
  {
    id: 1,
    asset: "BBAS3",
    price: "30,53",
    p_m: "30,53",
    amount: 53,
    rent_percentual: "3,06%",
    rent: "49,51",
    segment: "Ações",
  },
  {
    id: 2,
    asset: "MGLU3",
    price: "20,05",
    p_m: "20,05",
    amount: 20,
    rent_percentual: "-8,01%",
    rent: "-103,51",
    segment: "Ações",
  },
  {
    id: 3,
    asset: "TAEE11",
    price: "35,87",
    p_m: "35,87",
    amount: 103,
    rent_percentual: "50,00%",
    rent: "3.500,00",
    segment: "Ações",
  },
  {
    id: 4,
    asset: "KNCR11",
    price: "101,05",
    p_m: "101,05",
    amount: 10,
    rent_percentual: "2,00%",
    rent: "104,00",
    segment: "FIIS",
  },
  {
    id: 5,
    asset: "BBAS3",
    price: "30,53",
    p_m: "30,53",
    amount: 53,
    rent_percentual: "3,06%",
    rent: "49,51",
    segment: "Ações",
  },
  {
    id: 6,
    asset: "BBAS3",
    price: "30,53",
    p_m: "30,53",
    amount: 53,
    rent_percentual: "3,06%",
    rent: "49,51",
    segment: "Ações",
  },
];

const ITEMS_WIDTH = {
  asset: 78,
  price: 120,
  amount: 75,
  rent_percentual: 140,
  rent: 150,
  segment: 140,
  delete: 70,
};

const ItemList = ({ data }) => {
  return (
    <HStack>
      <View>
        {data.map((e, i) => {
          return (
            <VStack>
              {i === 0 && (
                <ItemContainer minW={ITEMS_WIDTH.asset}>
                  <Label>TICKER</Label>
                </ItemContainer>
              )}
              <ItemContainer minW={ITEMS_WIDTH.asset} ticker>
                <ItemContent number>{e.asset}</ItemContent>
              </ItemContainer>
            </VStack>
          );
        })}
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
      >
        <View>
          {data.map((e, i) => {
            return (
              <VStack>
                {i === 0 && (
                  <HStack>
                    <ItemContainer minW={ITEMS_WIDTH.price}>
                      <Label>PREÇO ATUAL</Label>
                    </ItemContainer>
                    <ItemContainer minW={ITEMS_WIDTH.price}>
                      <Label>PREÇO MÉDIO</Label>
                    </ItemContainer>
                    <ItemContainer minW={ITEMS_WIDTH.amount}>
                      <Label>COTAS</Label>
                    </ItemContainer>
                    <ItemContainer minW={ITEMS_WIDTH.rent_percentual}>
                      <Label>RENTABILIDADE %</Label>
                    </ItemContainer>
                    <ItemContainer minW={ITEMS_WIDTH.rent}>
                      <Label>RENTABILIDADE</Label>
                    </ItemContainer>
                    <ItemContainer minW={ITEMS_WIDTH.segment}>
                      <Label>SEGMENTO</Label>
                    </ItemContainer>
                    <ItemContainer minW={ITEMS_WIDTH.delete}>
                      <Label>EXCLUIR</Label>
                    </ItemContainer>
                  </HStack>
                )}
                <HStack>
                  <ItemContainer minW={ITEMS_WIDTH.price}>
                    <ItemContent number>{e.price}</ItemContent>
                  </ItemContainer>
                  <ItemContainer minW={ITEMS_WIDTH.price}>
                    <ItemContent number>{e.p_m}</ItemContent>
                  </ItemContainer>
                  <ItemContainer minW={ITEMS_WIDTH.amount}>
                    <ItemContent number>{e.amount}</ItemContent>
                  </ItemContainer>
                  <ItemContainer minW={ITEMS_WIDTH.rent_percentual}>
                    <ItemContent number>{e.rent_percentual}</ItemContent>
                  </ItemContainer>
                  <ItemContainer minW={ITEMS_WIDTH.rent}>
                    <ItemContent number>{e.rent}</ItemContent>
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
              </VStack>
            );
          })}
        </View>
      </ScrollView>
    </HStack>
  );
};

const Positions = () => {
  const [open, setOpen] = useState(true);

  return (
    <VStack mt={5} mb={open ? 0 : 10}>
      <Header>
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <HStack justifyContent="space-between">
            <HeaderText>Posições</HeaderText>
            <Icon name={open ? "chevron-down" : "chevron-right"} />
          </HStack>
        </TouchableOpacity>
      </Header>
      <Collapse isOpen={open}>
        <Container>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ItemList data={items} />
          </ScrollView>
        </Container>
      </Collapse>
    </VStack>
  );
};

export default Positions;
