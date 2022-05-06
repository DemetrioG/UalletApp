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
  convertDateFromDatabase,
} from "../../functions/index";
import { ChangeType, HorizontalView, TypeText, TypeView } from "./styles";
import {
  ButtonOutlineText,
  ButtonText,
  ContainerCenter,
  DeleteButton,
  FormContainer,
  StyledButton,
  StyledButtonOutline,
  StyledIcon,
  StyledInputDate,
  StyledLoading,
  StyledTextInput,
  StyledTextInputMask,
  TextHeaderScreen,
  ViewTabContent,
} from "../../styles/generalStyled";
import { metrics, colors } from "../../styles";
import { IEntryList } from "../Entry";

interface IForm {
  entrydate: string;
  description: string;
  value: string;
}

const schema = yup
  .object({
    entrydate: yup.string().required(),
    description: yup.string().required(),
    value: yup.string().required(),
  })
  .required();

export default function NewEntry({
  route: { params },
}: {
  route: { params: IEntryList };
}) {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = React.useContext(UserContext);
  const { setAlert } = React.useContext(AlertContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [type, setType] = React.useState<"Receita" | "Despesa">("Receita");
  const [modality, setModality] = React.useState<"Projetado" | "Real" | null>(
    null
  );
  const [segment, setSegment] = React.useState<string | null>(null);
  const [modalityVisible, setModalityVisible] = React.useState(false);
  const [segmentVisible, setSegmentVisible] = React.useState(false);
  const [calendar, setCalendar] = React.useState(false);

  const optionsModality = ["Projetado", "Real"];
  const optionsSegment = [
    "Lazer",
    "Educação",
    "Investimentos",
    "Necessidades",
    "Curto e médio prazo",
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    // Verifica se é Edição e preenche os dados nos campos
    if (params) {
      setIsEditing(true);
      setType(params.type);
      setModality(params.modality);
      setSegment(params.segment || null);
      setValue("entrydate", convertDateFromDatabase(params.date));
      setValue("description", params.description);
      setValue("value", params.value);
    }
  }, []);

  function setDateToInput(date: Date) {
    setValue("entrydate", convertDate(date));
  }

  async function registerEntry(
    { description, entrydate, value }: IForm,
    idRegister?: number
  ) {
    if (!modality || (type == "Despesa" && !segment)) {
      return setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Informe todos os campos",
        redirect: null,
      }));
    }

    if (entrydate.length < 10) {
      return setAlert(() => ({
        visibility: true,
        type: "error",
        title: "Verifique a data informada",
        redirect: null,
      }));
    }

    Keyboard.dismiss();
    setIsLoading(true);
    let id = idRegister ? idRegister : 1;

    if (!idRegister) {
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
    }

    // Registra o novo lançamento no banco
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(modality)
      .doc(id.toString())
      .set({
        id: id,
        date: convertDateToDatabase(entrydate),
        type: type,
        description: description,
        modality: modality,
        segment: segment,
        value: value,
      })
      .catch(() => {
        setAlert(() => ({
          visibility: true,
          type: "error",
          title: idRegister
            ? "Erro ao atualizar as informações"
            : "Erro ao cadastrar as informações",
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
      .doc(Number(entrydate.slice(3, 5)).toString())
      .get()
      .then((v) => {
        balance = v.data()?.balance;
      });

    if (!isEditing) {
      if (type == "Receita") {
        balance += realToNumber(value);
      } else {
        balance -= realToNumber(value);
      }
    } else {
      if (type == "Receita") {
        balance += realToNumber(value) - realToNumber(params.value);
      } else {
        balance -= realToNumber(value) - realToNumber(params.value);
      }
    }

    await firebase
      .firestore()
      .collection("balance")
      .doc(user.uid)
      .collection(modality)
      .doc(Number(entrydate?.slice(3, 5)).toString())
      .set({
        balance: balance,
      })
      .then(() => {
        setAlert(() => ({
          visibility: true,
          type: "success",
          title: idRegister
            ? "Lançamento atualizado com sucesso"
            : "Dados cadastrados com sucesso",
          redirect: "Lançamentos",
        }));
      });

    return setIsLoading(false);
  }

  async function deleteEntry() {
    setIsDelete(true);
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(params.modality)
      .doc(params.id.toString())
      .delete()
      .catch(() => {
        setAlert(() => ({
          visibility: true,
          type: "error",
          title: "Erro ao excluir o lançamento",
          redirect: null,
        }));
        return setIsDelete(false);
      });

    // Atualiza o saldo atual no banco
    let balance = 0;
    const dateMonth = Number(
      convertDateFromDatabase(params.date).slice(3, 5)
    ).toString();
    await firebase
      .firestore()
      .collection("balance")
      .doc(user.uid)
      .collection(params.modality)
      .doc(dateMonth)
      .get()
      .then((v) => {
        balance = v.data()?.balance;
      })
      .catch(() => {
        balance = 0;
      });

    if (params.type == "Despesa") {
      balance += realToNumber(params.value);
    } else {
      balance -= realToNumber(params.value);
    }

    await firebase
      .firestore()
      .collection("balance")
      .doc(user.uid)
      .collection(params.modality)
      .doc(dateMonth)
      .set({
        balance: balance,
      });

    return setAlert(() => ({
      visibility: true,
      type: "success",
      title: "Lançamento excluído com  sucesso",
      redirect: "Lançamentos",
    }));
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ViewTabContent noPaddingBottom>
        <HorizontalView noMarginBottom>
          <TouchableOpacity onPress={() => navigate("Lançamentos")}>
            <StyledIcon name="chevron-left" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TextHeaderScreen noMarginBottom>
            {isEditing ? "Editar lançamento" : "Novo lançamento"}
          </TextHeaderScreen>
        </HorizontalView>
        <TypeView>
          <TypeText type={type}>{type}</TypeText>
          {!isEditing && (
            <ChangeType
              onPress={() =>
                type == "Receita" ? setType("Despesa") : setType("Receita")
              }
            >
              <StyledIcon name="refresh-cw" size={15} />
            </ChangeType>
          )}
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
              {type == "Despesa" && (
                <Picker
                  options={optionsSegment}
                  selectedValue={setSegment}
                  value={!segment ? "Segmento" : segment}
                  type="Segmento"
                  visibility={segmentVisible}
                  setVisibility={setSegmentVisible}
                />
              )}
              <StyledTextInputMask
                name="value"
                placeholder="Valor"
                control={control}
                type="money"
                helperText={errors}
              />
            </FormContainer>
            {!isEditing && (
              <View>
                <StyledButton onPress={handleSubmit((e) => registerEntry(e))}>
                  {isLoading ? (
                    <StyledLoading />
                  ) : (
                    <ButtonText>CADASTRAR</ButtonText>
                  )}
                </StyledButton>
                <StyledButtonOutline>
                  <ButtonOutlineText>
                    CADASTRAR DESPESAS FIXAS
                  </ButtonOutlineText>
                </StyledButtonOutline>
              </View>
            )}
            {isEditing && (
              <View>
                <StyledButton
                  onPress={handleSubmit((e) => registerEntry(e, params.id))}
                >
                  {isLoading ? (
                    <StyledLoading />
                  ) : (
                    <ButtonText>ATUALIZAR</ButtonText>
                  )}
                </StyledButton>
                <DeleteButton onPress={deleteEntry}>
                  {isDelete ? (
                    <StyledLoading />
                  ) : (
                    <ButtonText>EXCLUIR</ButtonText>
                  )}
                </DeleteButton>
              </View>
            )}
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
