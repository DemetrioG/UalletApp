import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, HStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Toast from "react-native-toast-message";

import Icon from "../../../../components/Icon";
import TabView from "../../../../components/TabView";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  TextHeaderScreen,
  ViewTab,
} from "@styles/general";
import { convertDate, dateValidation } from "@utils/date.helper";
import TextInput from "../../../../components/TextInput";
import Calendar from "../../../../components/Calendar";
import { IPosition } from "../../../../components/Positions";
import { deleteAsset } from "./query";
import { registerAsset } from "../../NewAsset/NewVariableAsset/query";

export interface IForm {
  entrydate: string;
  asset: string;
  amount: number;
  price: string;
}

const schema = yup
  .object({
    entrydate: yup
      .string()
      .required()
      .min(10)
      .test("date", "Verifique a data informada", (value) =>
        dateValidation(value!)
      ),
    asset: yup.string(),
    amount: yup.number().required(),
    price: yup
      .string()
      .required()
      .test("price", "Informe o preço do ativo", (value) => value !== "R$0,00"),
  })
  .required();

const Form = ({ title, asset }: IPosition & { title: string }) => {
  const [calendar, setCalendar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { goBack } = useNavigation();

  const defaultValues = { asset: asset };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  function setDateToInput(date: Date) {
    setValue("entrydate", convertDate(date));
  }

  async function submit(fields: IForm) {
    setLoading(true);
    if (title === "VENDA") {
      deleteAsset(fields)
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Lançamento registrado com sucesso",
          });
          return goBack();
        })
        .catch(() => {
          return Toast.show({
            type: "error",
            text1: "Erro ao registrar lançamento",
          });
        })
        .finally(() => setLoading(false));
    } else if (title === "COMPRA") {
      registerAsset(fields)
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Lançamento registrado com sucesso",
          });
          return goBack();
        })
        .catch(() => {
          return Toast.show({
            type: "error",
            text1: "Erro ao registrar lançamento",
          });
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
          <TextInput
            name="asset"
            placeholder="Ativo"
            control={control}
            isDisabled
          />
          <TextInput
            name="amount"
            placeholder="Quantidade"
            keyboardType="decimal-pad"
            control={control}
            errors={errors.amount}
          />
          <TextInput
            name="price"
            placeholder="Preço"
            masked="money"
            control={control}
            errors={errors.price}
            helperText={
              errors.price?.message === "Informe o preço do ativo"
                ? errors.price.message
                : "Informe todos os campos"
            }
          />
          <Button mt={3} onPress={handleSubmit(submit)} isLoading={loading}>
            <ButtonText>CONFIRMAR {title}</ButtonText>
          </Button>
          <Calendar
            date={new Date()}
            setDateToInput={setDateToInput}
            calendarIsShow={calendar}
          />
        </FormContainer>
      </ContainerCenter>
    </TouchableWithoutFeedback>
  );
};

const routes = [
  { key: "first", title: "COMPRA" },
  { key: "second", title: "VENDA" },
];

const AssetMovement = ({
  route: { params },
}: {
  route: { params: IPosition };
}) => {
  const { goBack } = useNavigation();

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    switch (route.key) {
      case "first":
        return <Form {...route} {...params} />;
      case "second":
        return <Form {...route} {...params} />;
      default:
        return null;
    }
  };

  return (
    <BackgroundContainer>
      <ViewTab>
        <HStack alignItems="center" space={3} mb={10}>
          <Icon name="chevron-left" size={24} onPress={goBack} />
          <TextHeaderScreen noMarginBottom>Movimentações</TextHeaderScreen>
        </HStack>
        <TabView renderScene={renderScene} tabRoutes={routes} />
      </ViewTab>
    </BackgroundContainer>
  );
};

export default AssetMovement;
