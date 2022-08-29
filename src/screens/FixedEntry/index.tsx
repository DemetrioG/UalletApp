import * as React from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Picker from "../../components/Picker";
import Calendar from "../../components/Calendar";
import {
  dateValidation,
  convertDate,
  convertDateToDatabase,
  futureDate,
} from "../../utils/date.helper";
import { realToNumber } from "../../utils/number.helper";
import { HorizontalView, TypeText, TypeView } from "./styles";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  TextHeaderScreen,
  ViewTab,
  ViewTabContent,
} from "../../styles/general";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import { ENTRY_SEGMENT, MODALITY } from "../../components/Picker/options";
import {
  insertNewEntry,
  lastIdFromEntry,
  updateCurrentBalance,
} from "./querys";

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
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [modality, setModality] = React.useState<"Projetado" | "Real" | null>(
    null
  );
  const [segment, setSegment] = React.useState<string | null>(null);
  const [expenseAmount, setExpenseAmount] = React.useState<string | null>(null);
  const [modalityVisible, setModalityVisible] = React.useState(false);
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
      modality: yup
        .string()
        .test("modality", "Informe a modalidade", () => Boolean(modality!)),
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
        modality: modality!,
        segment: segment!,
        value: realToNumber(value),
      });

      // Atualiza o saldo atual no banco
      const didUpdateBalanceSucceed = await updateCurrentBalance({
        modality: modality!,
        value: realToNumber(value),
        docDate: Number(finalDate.slice(3, 5)).toString(),
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
    navigate("Lançamentos");
    return setIsLoading(false);
  }

  return (
    <BackgroundContainer>
      <ViewTab>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ViewTabContent noPaddingBottom>
            <HorizontalView>
              <TouchableOpacity onPress={() => navigate("Lançamentos")}>
                <Icon name="chevron-left" style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TextHeaderScreen noMarginBottom>
                Novo lançamento
              </TextHeaderScreen>
            </HorizontalView>
            <TypeView>
              <TypeText>Despesas Fixas</TypeText>
            </TypeView>
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
                  name="description"
                  placeholder="Descrição"
                  control={control}
                  errors={errors.description}
                  maxLength={40}
                />
                <Picker
                  options={MODALITY}
                  selectedValue={setModality}
                  value={!modality ? "Modalidade" : modality}
                  type="Modalidade"
                  visibility={modalityVisible}
                  setVisibility={setModalityVisible}
                  errors={errors.modality}
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
                <TextInput
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
          </ViewTabContent>
        </TouchableWithoutFeedback>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default FixedEntry;
