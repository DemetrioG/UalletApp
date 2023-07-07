import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, HStack, VStack } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Picker from "../../../components/Picker";
import Calendar from "../../../components/Calendar";
import {
  dateValidation,
  convertDate,
  convertDateToDatabase,
  futureDate,
} from "../../../utils/date.helper";
import { realToNumber } from "../../../utils/number.helper";
import { TypeText, TypeView } from "./styles";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  TextHeaderScreen,
  ViewTab,
} from "../../../styles/general";
import Icon from "../../../components/Icon";
import { FormTextInput } from "../../../components/Inputs/TextInput";
import {
  CLASSIFICATION,
  ENTRY_SEGMENT,
} from "../../../components/Picker/options";
import { insertNewEntry, lastIdFromEntry } from "./querys";
import { DataContext } from "../../../context/Data/dataContext";
// import { Schema } from "../NewEntries/styles";
import { updateCurrentBalance } from "../../../utils/query.helper";

interface IForm {
  entrydate: string;
  description: string;
  modality: string;
  segment: string;
  expense_amount: number;
  value: string;
}

const optionsExpenseAmount = Array.from({ length: 12 }, (_, i) => ++i);

const FixedEntry = () => {
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<any>>();
  const {
    data: { modality },
  } = React.useContext(DataContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [segment, setSegment] = React.useState<string | null>(null);
  const [expenseAmount, setExpenseAmount] = React.useState<string | null>(null);
  const [segmentVisible, setSegmentVisible] = React.useState(false);
  const [expenseAmountVisible, setExpenseAmountVisible] = React.useState(false);
  const [calendar, setCalendar] = React.useState(false);

  const schema = yup
    .object({
      entrydate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      description: yup.string().required(),
      segment: yup
        .string()
        .test("segment", "Informe o segmento", () => Boolean(segment!)),
      expense_amount: yup
        .string()
        .test("number", "Informe a quantidade", () => Boolean(expenseAmount!)),
      value: yup.string().required(),
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

  function setDateToInput(date: Date) {
    setValue("entrydate", convertDate(date));
  }

  async function registerEntry({ description, entrydate, value }: IForm) {
    Keyboard.dismiss();
    setIsLoading(true);

    // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
    let id = await lastIdFromEntry({ modality: modality! });
    if (id === -1) return;

    // Registra o novo lançamento no banco
    for (let index = 0; index < Number(expenseAmount); index++) {
      id++;

      let finalDate;
      if (index === 0) {
        finalDate = entrydate;
      } else {
        finalDate = futureDate(entrydate, index);
      }

      const didInsertSucceed = await insertNewEntry({
        id: id,
        date: convertDateToDatabase(finalDate),
        type: "Despesa",
        description: description,
        modality: modality,
        classification: CLASSIFICATION[0],
        segment: segment!,
        value: realToNumber(value),
      });

      const docRef = `${Number(
        finalDate.slice(3, 5)
      ).toString()}_${finalDate.slice(6, 10)}`;
      const didUpdateBalanceSucceed = await updateCurrentBalance({
        modality: modality!,
        sumBalance: false,
        value: realToNumber(value),
        docDate: docRef,
      });

      if (!didInsertSucceed || !didUpdateBalanceSucceed) {
        Toast.show({
          type: "error",
          text1: "Erro ao cadastrar as informações",
        });
        return setIsLoading(false);
      }
    }

    Toast.show({
      type: "success",
      text1: "Dados cadastrados com sucesso",
    });
    navigate("Lancamentos");
    return setIsLoading(false);
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <VStack flex={1}>
            <HStack alignItems="center" space={3} mb={1}>
              <Icon name="chevron-left" size={24} onPress={goBack} />
              <TextHeaderScreen noMarginBottom>
                {/* Novo lançamento <Schema>{modality}</Schema> */}
              </TextHeaderScreen>
            </HStack>
            <TypeView>
              <TypeText>Despesas Fixas</TypeText>
            </TypeView>
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
                <FormTextInput
                  name="description"
                  placeholder="Descrição"
                  control={control}
                  errors={errors.description}
                  maxLength={40}
                />
                <Picker
                  options={ENTRY_SEGMENT}
                  selectedValue={setSegment}
                  value={!segment ? "Segmento" : segment}
                  type="Segmento"
                  visibility={segmentVisible}
                  setVisibility={setSegmentVisible}
                  errors={errors.segment}
                />
                <Picker
                  options={optionsExpenseAmount as unknown as string[]}
                  selectedValue={setExpenseAmount}
                  value={!expenseAmount ? "Quantidade de meses" : expenseAmount}
                  type="Quantidade de meses"
                  visibility={expenseAmountVisible}
                  setVisibility={setExpenseAmountVisible}
                  errors={errors.expense_amount}
                />
                <FormTextInput
                  name="value"
                  placeholder="Valor"
                  control={control}
                  errors={errors.value}
                  masked="money"
                  helperText="Informe todos os campos"
                />
                <Button
                  isLoading={isLoading}
                  onPress={handleSubmit((e) => registerEntry(e))}
                >
                  <ButtonText>CADASTRAR</ButtonText>
                </Button>
              </FormContainer>
              <Calendar
                date={new Date()}
                setDateToInput={setDateToInput}
                calendarIsShow={calendar}
              />
            </ContainerCenter>
          </VStack>
        </TouchableWithoutFeedback>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default FixedEntry;
