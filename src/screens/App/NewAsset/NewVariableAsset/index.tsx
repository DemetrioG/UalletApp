import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, HStack, Text, VStack } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { registerAsset } from "./query";
import Picker from "../../../../components/Picker";
import Icon from "../../../../components/Icon";
import { FormTextInput } from "../../../../components/Inputs/TextInput";
import Calendar from "../../../../components/Calendar";
import { ASSET_SEGMENT, BROKER } from "../../../../components/Picker/options";
import { convertDate, dateValidation } from "../../../../utils/date.helper";
import { numberToReal, realToNumber } from "../../../../utils/number.helper";
import { checkAssetValid } from "../../../../utils/asset.helper";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  HalfContainer,
  FormContainer,
  TextHeaderScreen,
  ViewTab,
} from "../../../../styles/general";
import { Total } from "./styles";
import { AssetSegment } from "../../../../types/types";

export interface IForm {
  entrydate: string;
  segment?: AssetSegment | null;
  broker?: string | null;
  asset: string;
  amount: number;
  price: string;
  total?: string;
}

const NewVariableAsset = () => {
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();
  const [calendar, setCalendar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [segment, setSegment] = React.useState(null);
  const [broker, setBroker] = React.useState(null);
  const [total, setTotal] = React.useState("R$ 0,00");

  const [segmentVisible, setSegmentVisible] = React.useState(false);
  const [brokerVisible, setBrokerVisible] = React.useState(false);

  const schema = yup
    .object({
      entrydate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      segment: yup
        .string()
        .test("segment", "Informe um segmento", () => segment!),
      broker: yup.string().test("broker", "Informe a corretora", () => broker!),
      asset: yup
        .string()
        .required()
        .test("asset", "Ativo incorreto", (value) => checkAsset(value!)),
      amount: yup.number().required(),
      price: yup
        .string()
        .required()
        .test(
          "price",
          "Informe o preço dos ativos",
          (value) => value !== "R$0,00"
        ),
    })
    .required();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IForm>({
    reValidateMode: "onBlur",
    resolver: yupResolver(schema),
  });

  function setDateToInput(date: Date) {
    setValue("entrydate", convertDate(date));
  }

  async function checkAsset(value: string) {
    return await checkAssetValid(value, segment!)
      .then((response) => response)
      .catch(() => false);
  }

  function calculatesTotal() {
    const amount = watch("amount") || 0;
    const price = realToNumber(watch("price") || "R$0,00");
    return setTotal(numberToReal(Number((amount * price).toFixed(2))));
  }

  function submit({ entrydate, amount, asset, price }: IForm) {
    setLoading(true);
    const data: IForm = {
      entrydate: entrydate,
      amount: amount,
      asset: asset,
      price: price,
      broker: broker,
      segment: segment,
      total: total,
    };

    registerAsset(data)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Ativo cadastrado com sucesso",
        });
        return navigate("Investimentos");
      })
      .catch(() => {
        return Toast.show({
          type: "error",
          text1: "Erro ao cadastrar ativo",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <VStack flex={1}>
            <HStack alignItems="center" space={3} mb={1}>
              <Icon name="chevron-left" size={24} onPress={goBack} />
              <TextHeaderScreen noMarginBottom>Renda variável</TextHeaderScreen>
            </HStack>
            <ContainerCenter>
              <FormContainer insideApp>
                <FormTextInput
                  name="entrydate"
                  placeholder="Data lançamento"
                  control={control}
                  errors={errors.entrydate}
                  masked="datetime"
                  maxLength={10}
                  setCalendar={setCalendar}
                  withIcon
                  helperText="Verifique a data informada"
                />
                <Picker
                  options={ASSET_SEGMENT}
                  selectedValue={setSegment}
                  value={!segment ? "Segmento" : segment}
                  type="Segmento"
                  visibility={segmentVisible}
                  setVisibility={setSegmentVisible}
                  errors={errors.segment}
                />
                <Picker
                  options={BROKER}
                  selectedValue={setBroker}
                  value={!broker ? "Corretora" : broker}
                  type="Corretora"
                  visibility={brokerVisible}
                  setVisibility={setBrokerVisible}
                  errors={errors.broker}
                />
                <HStack justifyContent={"space-between"}>
                  <HalfContainer>
                    <FormTextInput
                      name="asset"
                      placeholder="Ativo"
                      control={control}
                      errors={errors.asset}
                      autoCorrect={false}
                      autoCapitalize={"characters"}
                    />
                  </HalfContainer>
                  <HalfContainer>
                    <FormTextInput
                      name="amount"
                      placeholder="Quantidade"
                      keyboardType="decimal-pad"
                      control={control}
                      errors={errors.amount}
                      onEndEditing={calculatesTotal}
                    />
                  </HalfContainer>
                </HStack>
                <FormTextInput
                  name="price"
                  placeholder="Preço"
                  masked="money"
                  control={control}
                  errors={errors.price}
                  helperText={
                    errors.price?.message === "Informe o preço dos ativos"
                      ? errors.price.message
                      : "Informe todos os campos"
                  }
                  onEndEditing={calculatesTotal}
                />
                <HStack mb={3} alignItems={"center"}>
                  <Text>Total</Text>
                  <Total>{total}</Total>
                </HStack>
                <Button onPress={handleSubmit(submit)} isLoading={loading}>
                  <ButtonText>CADASTRAR ATIVO</ButtonText>
                </Button>
              </FormContainer>
            </ContainerCenter>
            <Calendar
              date={new Date()}
              setDateToInput={setDateToInput}
              calendarIsShow={calendar}
            />
          </VStack>
        </TouchableWithoutFeedback>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default NewVariableAsset;
