import * as React from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import { UserContext } from "../../context/User/userContext";
import { AlertContext } from "../../context/Alert/alertContext";
import Picker from "../../components/Picker";
import Calendar from "../../components/Calendar";
import {
  convertDate,
  convertDateToDatabase,
  realToNumber,
  dateValidation,
  futureDate,
} from "../../functions/index";
import { HorizontalView, TypeText, TypeView } from "./styles";
import {
  ButtonText,
  ContainerCenter,
  FormContainer,
  StyledButton,
  StyledIcon,
  StyledInputDate,
  StyledLoading,
  StyledTextInput,
  StyledTextInputMask,
  TextHeaderScreen,
  ViewTabContent,
} from "../../styles/general";
import { metrics, colors } from "../../styles";

interface IForm {
  entrydate: string;
  description: string;
  value: string;
}

const optionsModality = ["Projetado", "Real"];
const optionsExpenseAmount: string[] = [];
const optionsSegment = [
  "Lazer",
  "Educação",
  "Investimentos",
  "Necessidades",
  "Curto e médio prazo",
];

for (let index = 1; index < 13; index++) {
  optionsExpenseAmount.push(index.toString());
}

const schema = yup
  .object({
    entrydate: yup.string().required(),
    description: yup.string().required(),
    value: yup.string().required(),
  })
  .required();

export default function FixedEntry() {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = React.useContext(UserContext);
  const { setAlert } = React.useContext(AlertContext);

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
    if (!modality || !segment || !expenseAmount) {
      return setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Informe todos os campos",
      }));
    }

    if (!dateValidation(entrydate)) {
      return setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Verifique a data informada",
      }));
    }

    Keyboard.dismiss();
    setIsLoading(true);
    let id = 0;

    // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(modality)
      .orderBy("id", "desc")
      .limit(1)
      .get()
      .then((v) => {
        v.forEach((result) => {
          id += result.data().id;
        });
      });

    // Registra o novo lançamento no banco
    for (let index = 0; index < Number(expenseAmount); index++) {
      id++;

      let finalDate;
      if (index === 0) {
        finalDate = entrydate;
      } else {
        finalDate = futureDate(entrydate, index);
      }

      await firebase
        .firestore()
        .collection("entry")
        .doc(user.uid)
        .collection(modality)
        .doc(id.toString())
        .set({
          id: id,
          date: convertDateToDatabase(finalDate),
          type: "Despesa",
          description: description,
          modality: modality,
          segment: segment,
          value: realToNumber(value),
        })
        .catch(() => {
          setAlert(() => ({
            visibility: true,
            type: "error",
            title: "Erro ao cadastrar as informações",
            redirect: null,
          }));
          return setIsLoading(false);
        });

      // Atualiza o saldo atual no banco
      let balance = 0;
      await firebase
        .firestore()
        .collection("balance")
        .doc(user.uid)
        .collection(modality)
        .doc(Number(finalDate.slice(3, 5)).toString())
        .get()
        .then((v) => {
          balance = v.data()?.balance || 0;
        });

      balance -= realToNumber(value);

      await firebase
        .firestore()
        .collection("balance")
        .doc(user.uid)
        .collection(modality)
        .doc(Number(finalDate.slice(3, 5)).toString())
        .set({
          balance: balance,
        })
        .then(() => {
          return setAlert(() => ({
            visibility: true,
            type: "success",
            title: "Dados cadastrados com sucesso",
            redirect: "Lançamentos",
          }));
        });
    }

    return setIsLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ViewTabContent noPaddingBottom>
        <HorizontalView noMarginBottom>
          <TouchableOpacity onPress={() => navigate("Lançamentos")}>
            <StyledIcon name="chevron-left" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TextHeaderScreen noMarginBottom>Novo lançamento</TextHeaderScreen>
        </HorizontalView>
        <TypeView>
          <TypeText>Despesas Fixas</TypeText>
        </TypeView>
        <ContainerCenter>
          <View>
            <FormContainer>
              <HorizontalView>
                <StyledInputDate
                  name="entrydate"
                  placeholder="Data lançamento"
                  type="datetime"
                  control={control}
                />
                <TouchableOpacity onPress={() => setCalendar(!calendar)}>
                  <StyledIcon
                    name="calendar"
                    color={colors.lightGray}
                    style={{ marginLeft: metrics.baseMargin }}
                  />
                </TouchableOpacity>
              </HorizontalView>
              <StyledTextInput
                name="description"
                placeholder="Descrição"
                control={control}
                maxLength={40}
              />
              <Picker
                options={optionsModality}
                selectedValue={setModality}
                value={!modality ? "Modalidade" : modality}
                type="Modalidade"
                visibility={modalityVisible}
                setVisibility={setModalityVisible}
              />
              <Picker
                options={optionsSegment}
                selectedValue={setSegment}
                value={!segment ? "Segmento" : segment}
                type="Segmento"
                visibility={segmentVisible}
                setVisibility={setSegmentVisible}
              />
              <Picker
                options={optionsExpenseAmount}
                selectedValue={setExpenseAmount}
                value={!expenseAmount ? "Quantidade de meses" : expenseAmount}
                type="Quantidade de meses"
                visibility={expenseAmountVisible}
                setVisibility={setExpenseAmountVisible}
              />
              <StyledTextInputMask
                name="value"
                placeholder="Valor"
                control={control}
                type="money"
                errors={errors}
              />
            </FormContainer>
            <View>
              <StyledButton onPress={handleSubmit((e) => registerEntry(e))}>
                {isLoading ? (
                  <StyledLoading />
                ) : (
                  <ButtonText>CADASTRAR</ButtonText>
                )}
              </StyledButton>
            </View>
          </View>
          <Calendar
            date={new Date()}
            setDateToInput={setDateToInput}
            calendarIsShow={calendar}
          />
        </ContainerCenter>
      </ViewTabContent>
    </TouchableWithoutFeedback>
  );
}
