import * as React from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import Picker from "../../components/Picker";
import Calendar from "../../components/Calendar";
import { UserContext } from "../../context/User/userContext";
import { AlertContext } from "../../context/Alert/alertContext";
import { DataContext } from "../../context/Data/dataContext";
import {
  dateValidation,
  convertDate,
  convertDateToDatabase,
  futureDate,
} from "../../utils/date.helper";
import { realToNumber } from "../../utils/number.helper";
import { networkConnection } from "../../utils/network.helper";
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

interface IForm {
  entrydate: string;
  description: string;
  value: string;
}

const optionsExpenseAmount: string[] = [];

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

const FixedEntry = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = React.useContext(UserContext);
  const {
    data: { isNetworkConnected },
  } = React.useContext(DataContext);
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
    if (networkConnection(isNetworkConnected!, setAlert)) {
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
                  setCalendar={setCalendar}
                  withIcon
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
                />
                <Picker
                  options={ENTRY_SEGMENT}
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
