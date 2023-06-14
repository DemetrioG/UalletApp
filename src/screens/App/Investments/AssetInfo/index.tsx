import * as React from "react";
import { Button, HStack, ScrollView, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import Icon from "../../../../components/Icon";
import { ItemContent } from "../../../../components/Positions/styles";
import {
  BackgroundContainer,
  ButtonText,
  TextHeaderScreen,
  ViewTab,
} from "../../../../styles/general";
import { ItemText } from "./styles";
import { numberToReal } from "@utils/number.helper";
import { IPosition } from "../../../../components/Positions";

const AssetInfoScreen = ({
  route: { params },
}: {
  route: { params: IPosition };
}) => {
  const { goBack, navigate } = useNavigation();

  return (
    <BackgroundContainer>
      <ViewTab>
        <HStack alignItems="center" space={3} mb={10}>
          <Icon name="chevron-left" size={24} onPress={goBack} />
          <TextHeaderScreen noMarginBottom>
            Informações do Ativo
          </TextHeaderScreen>
        </HStack>
        <ScrollView showsVerticalScrollIndicator={false} mb={4}>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Ticker
            </ItemText>
            <ItemText fontFamily={"mono"}>{params.asset}</ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Rentabilidade %
            </ItemText>
            <ItemContent
              number
              withColor
              negative={params.rentPercentual.toString().includes("-")}
              fontSize={"md"}
            >
              {params.rentPercentual}
            </ItemContent>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Rentabilidade R$
            </ItemText>
            <ItemContent
              number
              withColor
              negative={numberToReal(params.rent).includes("-")}
              fontSize={"md"}
            >
              {numberToReal(params.rent)}
            </ItemContent>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Preço atual
            </ItemText>
            <ItemText fontFamily={"mono"}>{params.atualPrice}</ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Preço médio
            </ItemText>
            <ItemText fontFamily={"mono"}>
              {numberToReal(params.price, true)}
            </ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Cotas
            </ItemText>
            <ItemText fontFamily={"mono"}>{params.amount}</ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Total investido
            </ItemText>
            <ItemText fontFamily={"mono"}>
              {numberToReal(params.total || 0, true)}
            </ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              P/VP
            </ItemText>
            <ItemText fontFamily={"mono"}>{params.pvp}</ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              DY
            </ItemText>
            <ItemText fontFamily={"mono"}>{params.dy}</ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              P/L
            </ItemText>
            <ItemText fontFamily={"mono"}>{params.pl || "-"}</ItemText>
          </VStack>
          <VStack mb={3}>
            <ItemText fontWeight="bold" label>
              Segmento
            </ItemText>
            <ItemText fontFamily={"mono"}>{params.segment}</ItemText>
          </VStack>
        </ScrollView>
        <Button
          onPress={() =>
            navigate(
              "Investimentos/AtivoInfo/Movimentacoes" as never,
              params as never
            )
          }
        >
          <ButtonText>COMPRAR / VENDER</ButtonText>
        </Button>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default AssetInfoScreen;
