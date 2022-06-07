import * as React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";

import firebase from "../../services/firebase";
import Picker from "../Picker";
import { dateValidation, numberToReal } from "../../functions";
import {
  ButtonText,
  ModalContainer,
  ModalView,
  StyledButton,
  StyledIcon,
  StyledInputDate,
  StyledKeyboardAvoidingView,
  StyledLoading,
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
import { IActiveFilter } from "../../screens/Entry";

interface IFilter {
  visible: boolean;
  type: "entry";
  filter: IActiveFilter;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: React.Dispatch<React.SetStateAction<IActiveFilter>>;
}

interface IForm {
  initialdate: string;
  finaldate: string;
  description: string;
}

const optionsType = ["Todos", "Receita", "Despesa"];
const optionsModality = ["Projetado", "Real"];
const optionsSegment = [
  "Todos",
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
  filter,
  setFilter,
}: IFilter) {
  const { user } = React.useContext(UserContext);
  const { alert, setAlert } = React.useContext(AlertContext);
  const [loading, setLoading] = React.useState(false);
  const [typeEntry, setTypeEntry] = React.useState<string | null>(null);
  const [typeEntryVisible, setTypeEntryVisible] = React.useState(false);
  const [modality, setModality] = React.useState<string | null>(null);
  const [modalityVisible, setModalityVisible] = React.useState(false);
  const [segment, setSegment] = React.useState<string | null>(null);
  const [segmentVisible, setSegmentVisible] = React.useState(false);
  const [initialLabel, setInitialLabel] = React.useState(0);
  const [finalLabel, setFinalLabel] = React.useState(0);
  const [maxValue, setMaxValue] = React.useState(0);
  const [isSliding, setIsSliding] = React.useState(false);

  const { control, handleSubmit, setValue } = useForm<IForm>();

  async function handleFilter({ description, initialdate, finaldate }: IForm) {
    if (
      !initialdate ||
      !finaldate ||
      initialdate.length !== 10 ||
      finaldate!.length !== 10
    ) {
      return setAlert(() => ({
        type: "error",
        title: "Informe o período dos filtros",
        visibility: true,
        redirect: null,
      }));
    }
    if (!dateValidation(initialdate) || !dateValidation(finaldate)) {
      return setAlert(() => ({
        type: "error",
        title: "Verifique o período informado",
        visibility: true,
        redirect: null,
      }));
    }
    if (!modality) {
      return setAlert(() => ({
        type: "error",
        title: "Informe a modalidade",
        visibility: true,
        redirect: null,
      }));
    }

    setLoading(true);
    setFilter(() => ({
      description: description,
      modality: modality,
      segment: segment !== "Todos" ? segment : null,
      typeEntry: typeEntry !== "Todos" ? typeEntry : null,
      initialDate: initialdate,
      finalDate: finaldate,
      initialValue: initialLabel,
      finalValue: finalLabel,
      isFiltered: true,
    }));
    setLoading(false);
    setVisible(false);
  }

  async function getMaxValue() {
    let maxValue = 0;
    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection("Real")
      .orderBy("value", "desc")
      .limit(1)
      .get()
      .then((v) => {
        v.forEach((result) => {
          const { value } = result.data();
          maxValue = value || 0;
        });
      });

    await firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection("Projetado")
      .orderBy("value", "desc")
      .limit(1)
      .get()
      .then((v) => {
        v.forEach((result) => {
          const { value } = result.data();
          if (value > maxValue) {
            maxValue = value || 0;
          }
        });
      });

    if (maxValue > 0) {
      setMaxValue(maxValue);
    } else {
      setMaxValue(100);
    }
  }

  React.useEffect(() => {
    if (visible) {
      setValue("initialdate", filter.initialDate!);
      setValue("finaldate", filter.finalDate!);
      setValue("description", filter.description!);
      setInitialLabel(filter.initialValue);
      setFinalLabel(filter.finalValue);
      setIsSliding(false);
    }

    if (maxValue === 0) {
      getMaxValue();
    }
  }, [visible]);

  React.useEffect(() => {
    if (!filter.isFiltered) {
      setTypeEntry(null);
      setModality(null);
      setSegment(null);
    }
  }, [filter]);

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      {alert.visibility && <Alert />}
      <StyledKeyboardAvoidingView>
        <ModalContainer>
          <ModalView filter height={470}>
            <HeaderContainer>
              <Title>Filtros</Title>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <StyledIcon name="x" />
              </TouchableOpacity>
            </HeaderContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
              <InputContainer>
                <DateContainer>
                  <StyledInputDate
                    name="initialdate"
                    placeholder="Data Inicial *"
                    type="datetime"
                    control={control}
                  />
                  <StyledInputDate
                    name="finaldate"
                    placeholder="Data Final *"
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
                  maximumValue={maxValue}
                  value={filter.initialValue}
                  onTouchStart={() => setIsSliding(true)}
                  onValueChange={(value) => {
                    if (isSliding) {
                      setInitialLabel(value);
                    }
                  }}
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
                  maximumValue={maxValue}
                  value={filter.finalValue}
                  onTouchStart={() => setIsSliding(true)}
                  onValueChange={(value) => {
                    if (isSliding) {
                      setFinalLabel(value);
                    }
                  }}
                  tapToSeek
                  step={1}
                />
              </View>
            </ScrollView>
            <ButtonContainer>
              <StyledButton onPress={handleSubmit(handleFilter)}>
                {loading ? <StyledLoading /> : <ButtonText>APLICAR</ButtonText>}
              </StyledButton>
            </ButtonContainer>
          </ModalView>
        </ModalContainer>
      </StyledKeyboardAvoidingView>
    </Modal>
  );
}
