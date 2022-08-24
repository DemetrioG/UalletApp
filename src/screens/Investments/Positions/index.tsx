import React, { useContext, useEffect, useState } from "react";
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
import { UserContext } from "../../../context/User/userContext";
import { getAssets, getUpdatedInfos, IAsset } from "./query";

const ITEMS_WIDTH = {
  asset: 78,
  price: 120,
  amount: 75,
  rentPercentual: 140,
  rent: 150,
  segment: 140,
  delete: 70,
};

const ItemList = ({ data }: { data: IAsset[] }) => {
  return (
    <HStack>
      <View>
        {data.map((e, i) => {
          return (
            <VStack key={i}>
              {i === 0 && (
                <ItemContainer minW={ITEMS_WIDTH.asset}>
                  <Label>TICKER</Label>
                </ItemContainer>
              )}
              <ItemContainer
                minW={ITEMS_WIDTH.asset}
                ticker
                borderWidth={0.8}
                borderColor={"transparent"}
              >
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
              <VStack key={i}>
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
                    <ItemContainer minW={ITEMS_WIDTH.rentPercentual}>
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
                    <ItemContent number>{e.atualPrice}</ItemContent>
                  </ItemContainer>
                  <ItemContainer minW={ITEMS_WIDTH.price}>
                    <ItemContent number>{e.price}</ItemContent>
                  </ItemContainer>
                  <ItemContainer minW={ITEMS_WIDTH.amount}>
                    <ItemContent number>{e.amount}</ItemContent>
                  </ItemContainer>
                  <ItemContainer minW={ITEMS_WIDTH.rentPercentual}>
                    <ItemContent number>{e.rentPercentual}</ItemContent>
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
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<IAsset[]>([]);

  useEffect(() => {
    async function getData() {
      await getAssets(user.uid!).then((data) => {
        getUpdatedInfos(data).then((infos) => {
          const finalData: IAsset[] = [];
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

            return finalData.push(newData);
          });

          setData(finalData);
        });
      });
    }
    getData();
  }, []);

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
            <ItemList data={data} />
          </ScrollView>
        </Container>
      </Collapse>
    </VStack>
  );
};

export default Positions;
