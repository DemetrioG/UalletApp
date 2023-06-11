import * as React from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, HStack, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { getTreasure, registerAsset } from "./query";
import { UserContext } from "../../../../context/User/userContext";
import Picker from "@components/Picker";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import Calendar from "@components/Calendar";
import { BROKER } from "@components/Picker/options";
import { convertDate, dateValidation } from "@utils/date.helper";
import { sortObjectByKey } from "@utils/array.helper";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HalfContainer,
  TextHeaderScreen,
  ViewTab,
} from "@styles/general";
import { IFixedIncome } from "../../../../types/assets";

interface IForm {
  entrydate: string;
  title: string;
  broker: string;
  rent: string;
  duedate: string;
  price: string;
  cdbname: string;
}

const RENT_OPTIONS = ["Selic", "CDI", "IPCA +", "Pré Fix.", "Pós Fix."];

const NewFixAsset = () => {
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = React.useContext(UserContext);
  const [selic, setSelic] = React.useState<string | null>(null);
  const [rentType, setRentType] = React.useState("Selic");
  const [calendar, setCalendar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState<string | null>(null);
  const [broker, setBroker] = React.useState(null);

  const [TITLE_OPTIONS, SET_TITLE_OPTIONS] = React.useState<string[]>([]);

  const [titleVisible, setTitleVisible] = React.useState(false);
  const [brokerVisible, setBrokerVisible] = React.useState(false);

  const CDBIsSetted = title === "Certificado de Depósito Bancário";

  const schema = yup
    .object({
      entrydate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      title: yup
        .string()
        .test("segment", "Informe um título", () => Boolean(title!)),
      cdbname: yup
        .string()
        .test("cdb", "Informe o nome do CDB", (value) =>
          CDBIsSetted ? (value?.length ? true : false) : true
        ),
      broker: yup.string().test("broker", "Informe a corretora", () => broker!),
      rent: yup.string().required(),
      duedate: yup
        .string()
        .test("date", "Verifique a data informada", (value) =>
          value?.length && value !== "" ? dateValidation(value!) : true
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
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const setDateToInput = (date: Date) => {
    setValue("entrydate", convertDate(date));
  };

  const changeRentType = () => {
    const index = RENT_OPTIONS.indexOf(rentType) + 1;
    const newValue = RENT_OPTIONS[index >= RENT_OPTIONS.length ? 0 : index];
    return setRentType(newValue);
  };

  const submit = ({ entrydate, cdbname, rent, duedate, price }: IForm) => {
    const CDB = cdbname && cdbname !== "";
    const DUEDATE = duedate && duedate !== "";

    setLoading(true);
    const data: IFixedIncome = {
      entrydate: entrydate,
      title: title,
      cdbname: CDB ? cdbname : null,
      broker: broker,
      rent: rent,
      rentType: rentType,
      duedate: DUEDATE ? duedate : null,
      price: price,
      uid: user.uid!,
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
  };

  React.useEffect(() => {
    const fillTitlePicker = () => {
      const names: string[] = [
        "Certificado de Depósito Bancário",
        "Letra de Crédito",
        "Letra de Crédito Imobiliário",
        "Letra de Crédito do Agronegócio",
      ];

      getTreasure().then((data) => {
        const sortedData = sortObjectByKey(data, "name", "asc");
        sortedData.map((e) => names.push(e.name));
      });

      return SET_TITLE_OPTIONS(names);
    };
    fillTitlePicker();
  }, []);

  React.useEffect(() => {
    const changeRentTypeWithTitle = () => {
      const SELIC = title?.includes("Selic");
      const CDB = title?.includes("Certificado de Depósito");
      const IPCA = title?.includes("IPCA");
      const PREFIX = title?.includes("Prefixado");

      if (SELIC) {
        setValue("rent", selic!);
        setRentType(RENT_OPTIONS[0]);
      } else {
        setValue("rent", "");
      }

      if (CDB) {
        setRentType(RENT_OPTIONS[1]);
      } else if (IPCA) {
        setRentType(RENT_OPTIONS[2]);
      } else if (PREFIX) {
        setRentType(RENT_OPTIONS[3]);
      }
    };
    changeRentTypeWithTitle();
  }, [title]);

  return (
    <BackgroundContainer>
      <ViewTab>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <VStack flex={1}>
            <HStack alignItems="center" space={3} mb={1}>
              <Icon name="chevron-left" size={24} onPress={goBack} />
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
                    name="cdbname"
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
                <TouchableOpacity onPress={changeRentType}>
                  <HStack mb={1} alignItems={"center"}>
                    <Text>{rentType}</Text>
                    <Icon name="corner-right-down" size={12} />
                  </HStack>
                </TouchableOpacity>
                <HStack justifyContent={"space-between"}>
                  <HalfContainer>
                    <TextInput
                      name="rent"
                      placeholder="Rentabilidade"
                      control={control}
                      errors={errors.rent}
                      masked="money"
                      options={{
                        unit: "% ",
                      }}
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
          </VStack>
        </TouchableWithoutFeedback>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default NewFixAsset;
