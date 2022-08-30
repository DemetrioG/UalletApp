import * as React from "react";
import { HStack, ScrollView, VStack } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { IAsset } from "../Positions/query";
import Icon from "../../../components/Icon";
import TextInput from "../../../components/TextInput";
import { ConfirmContext } from "../../../context/ConfirmDialog/confirmContext";
import { ItemContent } from "../Positions/styles";
import {
  BackgroundContainer,
  ButtonDelete,
  ButtonText,
  TextHeaderScreen,
  ViewTab,
} from "../../../styles/general";
import { ItemText } from "./styles";
import { deleteAsset } from "./query";
import { UserContext } from "../../../context/User/userContext";
import { numberToReal } from "../../../utils/number.helper";

interface IForm {
  amount: number;
}

const schema = yup
  .object({
    amount: yup.number().required(),
  })
  .required();

const AssetInfoScreen = ({
  route: { params },
}: {
  route: { params: IAsset };
}) => {
  const { goBack } = useNavigation();
  const { setConfirm } = React.useContext(ConfirmContext);
  const { user } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function submit({ amount }: IForm) {
    setConfirm(() => ({
      title: "Deseja realmente excluir este ativo?",
      visibility: true,
      callbackFunction: () => handleDelete(amount),
    }));
  }

  function handleDelete(amount: number) {
    setLoading(true);
    deleteAsset(params.asset, user.uid!, amount)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Ativo excluído com sucesso",
        });
        goBack();
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao excluir ativo",
        });
      })
      .finally(() => setLoading(false));
  }

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
              negative={params.rentPercentual.includes("-")}
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
        <TextInput
          control={control}
          name="amount"
          keyboardType="decimal-pad"
          placeholder="Quantidade de cotas"
          errors={errors.amount}
        />
        <ButtonDelete onPress={handleSubmit(submit)} isLoading={loading}>
          <ButtonText>EXCLUIR ATIVO</ButtonText>
        </ButtonDelete>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default AssetInfoScreen;
