import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import { TextInputMask } from "react-native-masked-text";

import firebase from "../../services/firebase";
import {
  convertDate,
  convertDateToDatabase,
  realToNumber,
  convertDateFromDatabase,
} from "../../functions/index";
import { general, metrics, colors } from "../../styles";
import styles, {
  ChangeType,
  HorizontalView,
  TypeText,
  TypeView,
} from "./styles";
import Picker from "../../components/Picker";
import Calendar from "../../components/Calendar";
import { editTitleAlert } from "../../components/Actions/titleAlertAction";
import { editTypeAlert } from "../../components/Actions/typeAlertAction";
import { editVisibilityAlert } from "../../components/Actions/visibilityAlertAction";
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AlertContext } from "../../context/Alert/alertContext";
import { UserContext } from "../../context/User/userContext";
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
  const { user, setUser } = useContext(UserContext);
  const { alert, setAlert } = useContext(AlertContext);
  const opacity = useRef(new Animated.Value(0)).current;

  const [register, setRegister] = useState(false);
  const [exclude, setExclude] = useState(false);

  /**
   * @type new  Novo lançamento
   * @type edit Editar lançamento
   * @type fix  Nova despesa fixa
   */
  const [typeScreen, setTypeScreen] = useState("new");
  const [type, setType] = useState<"Receita" | "Despesa">("Receita");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [modality, setModality] = useState<typeof optionsModality | null>(null);
  const [segment, setSegment] = useState<typeof optionsSegment | null>(null);
  const [modalityVisible, setModalityVisible] = useState(null);
  const [segmentVisible, setSegmentVisible] = useState(null);
  const [calendar, setCalendar] = useState(false);

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

  useEffect(() => {
    // Verifica se é Edição e preenche os dados nos campos
    if (params) {
      setTypeScreen("edit");
      setType(params.type);
      setModality(params.modality);
      setValue("entrydate", convertDateFromDatabase(params.date));
      setValue("description", params.description);
      setValue("value", params.value);

      const segmentParam = params.segment;
      if (segmentParam) {
        setSegment(segmentParam);
      }
    }
  }, []);

  function onChangeDate(date) {
    setCalendar(Platform.OS === "ios");
    setValue("entrydate", convertDate(date));
  }

  function dateFade() {
    if (!calendar) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCalendar(true);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCalendar(false);
    }
  }

  function closeAndroid() {
    setCalendar(false);
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

    setRegister(true);
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
        date: convertDateToDatabase(date),
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
        return setRegister(false);
      });

    // Atualiza o saldo atual no banco
    let balance;
    await firebase
      .firestore()
      .collection("balance")
      .doc(user.uid)
      .collection(modality)
      .doc(Number(date.slice(3, 5)).toString())
      .get()
      .then((v) => {
        balance = v.data().balance;
      })
      .catch(() => {
        balance = 0;
      });

    if (typeScreen == "new") {
      if (type == "Receita") {
        balance += realToNumber(value);
      } else {
        balance -= realToNumber(value);
      }
    } else if (typeScreen == "edit") {
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
      .doc(Number(date.slice(3, 5)).toString())
      .set({
        balance: balance,
      });
    setAlert(() => ({
      visibility: true,
      type: "success",
      title: idRegister
        ? "Lançamento atualizado com sucesso"
        : "Dados cadastrados com sucesso",
      redirect: "Lançamentos",
    }));
  }

  async function deleteEntry() {
    setExclude(true);
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
        return setExclude(false);
      });

    // Atualiza o saldo atual no banco
    let balance;
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
        balance = v.data().balance;
      })
      .catch((error) => {
        balance = 0;
      });

    if (params.type == "Despesa") {
      balance += realToNumber(params.value);
    } else {
      balance -= realToNumber(params.value);
    }

    firebase
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
            {typeScreen == "new"
              ? "Novo Lançamento"
              : typeScreen == "edit"
              ? "Editar lançamento"
              : null}
          </TextHeaderScreen>
        </HorizontalView>
        <TypeView>
          <TypeText type={type}>{type}</TypeText>
          {typeScreen == "new" && (
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
                <TouchableOpacity onPress={() => dateFade()}>
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
            {typeScreen == "new" && (
              <View>
                <StyledButton onPress={handleSubmit((e) => registerEntry(e))}>
                  {register ? (
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
            {typeScreen == "edit" && (
              <View>
                <StyledButton
                  onPress={handleSubmit((e) => registerEntry(e, params.id))}
                >
                  {register ? (
                    <StyledLoading />
                  ) : (
                    <ButtonText>ATUALIZAR</ButtonText>
                  )}
                </StyledButton>
                <DeleteButton onPress={deleteEntry}>
                  {exclude ? (
                    <StyledLoading />
                  ) : (
                    <ButtonText>EXCLUIR</ButtonText>
                  )}
                </DeleteButton>
              </View>
            )}
          </View>
          {calendar ? (
            <Animated.View
              style={{
                position: "absolute",
                justifyContent: "flex-end",
                width: "100%",
                bottom: 0,
                opacity,
              }}
            >
              <Calendar
                onClose={Platform.OS === "ios" ? dateFade : closeAndroid}
                date={new Date()}
                onChange={onChangeDate}
              />
            </Animated.View>
          ) : null}
        </ContainerCenter>
      </ViewTabContent>
    </TouchableWithoutFeedback>
  );
}
