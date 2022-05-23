import * as React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";

import firebase from "../../services/firebase";
import Picker from "../Picker";
import { convertDateToDatabase, numberToReal } from "../../functions";
import {
  ButtonText,
  ModalContainer,
  ModalView,
  StyledButton,
  StyledIcon,
  StyledInputDate,
  StyledSlider,
  StyledTextInput,
} from "../../styles/general";
import {
  ButtonContainer,
  DateContainer,
  HeaderContainer,
  InputContainer,
  LabelContainer,
  LabelText,
  LabelValue,
  Title,
} from "./styles";
import { UserContext } from "../../context/User/userContext";
import { AlertContext } from "../../context/Alert/alertContext";
import Alert from "../Alert";
import { IEntryList } from "../../screens/Entry";

interface IFilter {
  visible: boolean;
  type: "entry";
  empty: React.Dispatch<React.SetStateAction<boolean>>;
  setList: React.Dispatch<React.SetStateAction<IEntryList[]>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IForm {
  initialdate: string;
  finaldate: string;
  description: string;
}

const optionsType = ["Receita", "Despesa"];
const optionsModality = ["Projetado", "Real"];
const optionsSegment = [
  "Lazer",
  "Educação",
  "Investimentos",
  "Necessidades",
  "Curto e médio prazo",
];

export default function Filter({
  visible,
  setVisible,
  type,
  setList,
  empty,
}: IFilter) {
  const { user, setUser } = React.useContext(UserContext);
  const { alert, setAlert } = React.useContext(AlertContext);
  const [typeEntry, setTypeEntry] = React.useState<string | null>(null);
  const [typeEntryVisible, setTypeEntryVisible] = React.useState(false);
  const [modality, setModality] = React.useState<string | null>(null);
  const [modalityVisible, setModalityVisible] = React.useState(false);
  const [segment, setSegment] = React.useState<string | null>(null);
  const [segmentVisible, setSegmentVisible] = React.useState(false);
  const [initialLabel, setInitialLabel] = React.useState(0);
  const [finalLabel, setFinalLabel] = React.useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>();

  function closeFilter() {
    setVisible(false);
    setInitialLabel(0);
    setFinalLabel(0);
    setTypeEntry(null);
    setModality(null);
    setSegment(null);
  }

  async function handleFilter({ description, initialdate, finaldate }: IForm) {
    if (!modality) {
      setAlert(() => ({
        type: "error",
        title: "Informe a modalidade",
        visibility: true,
        redirect: null,
      }));
    }
    let baseQuery: firebase.firestore.Query = firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(modality!);

    if (initialdate) {
      baseQuery = baseQuery.where(
        "date",
        ">=",
        convertDateToDatabase(initialdate)
      );
    }
    if (finaldate) {
      baseQuery = baseQuery.where(
        "date",
        "<=",
        convertDateToDatabase(finaldate)
      );
    }
    if (description) {
      baseQuery = baseQuery.where("description", "==", description);
    }
    if (segment) {
      baseQuery = baseQuery.where("segment", "==", segment);
    }
    if (typeEntry) {
      baseQuery = baseQuery.where("type", "==", typeEntry);
    }
    if (initialLabel > 0) {
      baseQuery = baseQuery.where("value", ">=", initialLabel);
    }
    if (finalLabel > 0) {
      baseQuery = baseQuery.where("value", "<=", finalLabel);
    }

    baseQuery.onSnapshot((snapshot) => {
      if (snapshot.docs.length > 0) {
        setList([]);
        empty(false);
        snapshot.forEach((result) => {
          setList((oldArray: any) => [...oldArray, result.data()]);
        });
      } else {
        setList([]);
        empty(true);
      }
      setVisible(false);
    });
  }

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      {alert.visibility && <Alert />}
      <ModalContainer>
        <ModalView filter height={470}>
          <HeaderContainer>
            <Title>Filtros</Title>
            <TouchableOpacity onPress={closeFilter}>
              <StyledIcon name="x" />
            </TouchableOpacity>
          </HeaderContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputContainer>
              <DateContainer>
                <StyledInputDate
                  name="initialdate"
                  placeholder="Data Inicial"
                  type="datetime"
                  control={control}
                />
                <StyledInputDate
                  name="finaldate"
                  placeholder="Data Final"
                  type="datetime"
                  control={control}
                />
              </DateContainer>
            </InputContainer>
            <InputContainer>
              <StyledTextInput
                name="description"
                placeholder="Descrição"
                control={control}
              />
            </InputContainer>
            <Picker
              options={optionsModality}
              selectedValue={setModality}
              value={!modality ? "Modalidade *" : modality}
              type="Modalidade"
              visibility={modalityVisible}
              setVisibility={setModalityVisible}
            />
            <Picker
              options={optionsType}
              selectedValue={setTypeEntry}
              value={!typeEntry ? "Tipo" : typeEntry}
              type="Tipo"
              visibility={typeEntryVisible}
              setVisibility={setTypeEntryVisible}
            />
            {typeEntry !== "Receita" && (
              <Picker
                options={optionsSegment}
                selectedValue={setSegment}
                value={!segment ? "Segmento" : segment}
                type="Segmento"
                visibility={segmentVisible}
                setVisibility={setSegmentVisible}
              />
            )}
            <View>
              <LabelContainer>
                <LabelText>Valor inicial</LabelText>
                <LabelValue>{numberToReal(initialLabel)}</LabelValue>
              </LabelContainer>
              <StyledSlider
                minimumValue={0}
                maximumValue={100}
                onValueChange={(value) => setInitialLabel(value)}
                tapToSeek
                step={1}
              />
            </View>
            <View>
              <LabelContainer>
                <LabelText>Valor final</LabelText>
                <LabelValue>{numberToReal(finalLabel)}</LabelValue>
              </LabelContainer>
              <StyledSlider
                minimumValue={0}
                maximumValue={100}
                onValueChange={(value) => setFinalLabel(value)}
                tapToSeek
                step={1}
              />
            </View>
          </ScrollView>
          <ButtonContainer>
            <StyledButton onPress={handleSubmit(handleFilter)}>
              <ButtonText>APLICAR</ButtonText>
            </StyledButton>
          </ButtonContainer>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
}
