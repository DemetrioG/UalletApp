import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Icon from "../../../components/Icon";
import TextInput from "../../../components/TextInput";
import Calendar from "../../../components/Calendar";
import { convertDate, dateValidation } from "../../../utils/date.helper";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HalfContainer,
  TextHeaderScreen,
  ViewTab,
  ViewTabContent,
} from "../../../styles/general";
import Picker from "../../../components/Picker";
import { ASSET_SEGMENT, BROKER } from "../../../components/Picker/options";
import { Total, TotalLabel } from "./styles";
import { numberToReal, realToNumber } from "../../../utils/number.helper";
import { IAsset, registerAsset } from "./query";
import { UserContext } from "../../../context/User/userContext";
import { AlertContext } from "../../../context/Alert/alertContext";

interface IForm {
  entrydate: string;
  segment: string;
  broker: string;
  asset: string;
  amount: number;
  price: string;
}

const NewVariableAsset = () => {
  const navigation = useNavigation();
  const { user } = React.useContext(UserContext);
  const { setAlert } = React.useContext(AlertContext);
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
      asset: yup.string().required(),
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
    resolver: yupResolver(schema),
  });

  function setDateToInput(date: Date) {
    setValue("entrydate", convertDate(date));
  }

  function calculatesTotal() {
    const amount = watch("amount") || 0;
    const price = realToNumber(watch("price") || "R$0,00");
    return setTotal(numberToReal(Number((amount * price).toFixed(2))));
  }

  function submit({ entrydate, amount, asset, price }: IForm) {
    setLoading(true);
    const data: IAsset = {
      entrydate: entrydate,
      amount: amount,
      asset: asset,
      price: price,
      broker: broker,
      segment: segment,
      total: total,
      uid: user.uid!,
    };

    registerAsset(data)
      .then(() => {
        return setAlert(() => ({
          visibility: true,
          type: "success",
          title: "Ativo cadastrado com sucesso",
          redirect: "Investimentos",
        }));
      })
      .catch(() => {
        return setAlert(() => ({
          visibility: true,
          type: "error",
          title: "Erro ao cadastrar ativo",
          redirect: "Investimentos",
        }));
      })
      .finally(() => setLoading(false));
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ViewTabContent noPaddingBottom>
            <HStack>
              <Icon
                name="chevron-left"
                style={{ marginRight: 10 }}
                onPress={() => navigation.goBack()}
              />
              <TextHeaderScreen noMarginBottom>Renda variável</TextHeaderScreen>
            </HStack>
            <ContainerCenter>
              <FormContainer insideApp>
                <TextInput
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
                    <TextInput
                      name="asset"
                      placeholder="Ativo"
                      control={control}
                      errors={errors.asset}
                      autoCorrect={false}
                      autoCapitalize={"characters"}
                    />
                  </HalfContainer>
                  <HalfContainer>
                    <TextInput
                      name="amount"
                      placeholder="Quantidade"
                      keyboardType="decimal-pad"
                      control={control}
                      errors={errors.amount}
                      onEndEditing={calculatesTotal}
                    />
                  </HalfContainer>
                </HStack>
                <TextInput
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
                  <TotalLabel>Total</TotalLabel>
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
          </ViewTabContent>
        </TouchableWithoutFeedback>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default NewVariableAsset;
