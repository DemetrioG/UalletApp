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
import axios, { ITesouro, TESOURO_URL } from "../../../utils/api.helper";
import { sortObjectByKey } from "../../../utils/array.helper";

interface IForm {
  entrydate: string;
  title: string;
  broker: string;
  rent: string;
  duedate: number;
  price: string;
  cdbname: string;
}

const NewFixAsset = () => {
  const navigation = useNavigation();
  const { user } = React.useContext(UserContext);
  const { setAlert } = React.useContext(AlertContext);
  const [calendar, setCalendar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState(null);
  const [broker, setBroker] = React.useState(null);

  const [TITLE_OPTIONS, SET_TITLE_OPTIONS] = React.useState<string[]>([]);

  const [titleVisible, setTitleVisible] = React.useState(false);
  const [brokerVisible, setBrokerVisible] = React.useState(false);

  const CDBIsSetted = title === "CDB";

  const schema = yup
    .object({
      entrydate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      title: yup.string().test("segment", "Informe um título", () => title!),
      cdbname: yup
        .string()
        .test("cdb", "Informe o nome do CDB", (value) =>
          CDBIsSetted ? (value?.length ? true : false) : true
        ),
      broker: yup.string().test("broker", "Informe a corretora", () => broker!),
      rent: yup.string().required(),
      duedate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
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

  function submit({ entrydate, amount, asset, price }: IForm) {
    // setLoading(true);
    // const data: IAsset = {
    //   entrydate: entrydate,
    //   amount: amount,
    //   asset: asset,
    //   price: price,
    //   broker: broker,
    //   segment: segment,
    //   total: total,
    //   uid: user.uid!,
    // };
    // registerAsset(data)
    //   .then(() => {
    //     return setAlert(() => ({
    //       visibility: true,
    //       type: "success",
    //       title: "Ativo cadastrado com sucesso",
    //       redirect: "Investimentos",
    //     }));
    //   })
    //   .catch(() => {
    //     return setAlert(() => ({
    //       visibility: true,
    //       type: "error",
    //       title: "Erro ao cadastrar ativo",
    //       redirect: "Investimentos",
    //     }));
    //   })
    //   .finally(() => setLoading(false));
  }

  React.useEffect(() => {
    axios.get(TESOURO_URL).then(({ data }: { data: ITesouro[] }) => {
      const names: string[] = ["CDB"];
      const sortedData = sortObjectByKey(data, "NOME", "asc");
      sortedData.map((e) => names.push(e.NOME));

      return SET_TITLE_OPTIONS(names);
    });
  }, []);

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
              <TextHeaderScreen noMarginBottom>Renda fixa</TextHeaderScreen>
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
                  options={TITLE_OPTIONS}
                  selectedValue={setTitle}
                  value={!title ? "Título" : title}
                  type="Título"
                  visibility={titleVisible}
                  setVisibility={setTitleVisible}
                  errors={errors.title}
                />
                {CDBIsSetted && (
                  <TextInput
                    name="entrydate"
                    placeholder="Nome do CDB"
                    control={control}
                    errors={errors.cdbname}
                  />
                )}
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
                      name="rent"
                      placeholder="Rentabilidade"
                      control={control}
                      errors={errors.rent}
                      keyboardType="decimal-pad"
                    />
                  </HalfContainer>
                  <HalfContainer>
                    <TextInput
                      name="duedate"
                      placeholder="Vencimento"
                      masked="datetime"
                      maxLength={10}
                      control={control}
                      errors={errors.duedate}
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
                    errors.price?.message === "Informe o preço do título"
                      ? errors.price.message
                      : "Informe todos os campos"
                  }
                />
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

export default NewFixAsset;
