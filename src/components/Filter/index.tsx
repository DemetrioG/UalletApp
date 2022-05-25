import * as React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";

import firebase from "../../services/firebase";
import Picker from "../Picker";
import {
  convertDateToDatabase,
  dateValidation,
  numberToReal,
} from "../../functions";
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
import { IEntryList } from "../../screens/Entry";

interface IFilter {
  visible: boolean;
  type: "entry";
  isFiltered: boolean;
  empty: React.Dispatch<React.SetStateAction<boolean>>;
  setList: React.Dispatch<React.SetStateAction<IEntryList[]>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IForm {
  initialdate: string;
  finaldate: string;
  description: string;
}

interface IActiveFilter {
  initialDate: string | null;
  finalDate: string | null;
  description: string | null;
  modality: string | null;
  typeEntry: string | null;
  segment: string | null;
  initialValue: number;
  finalValue: number;
  isFiltered: boolean;
}

const defaultFilter: IActiveFilter = {
  initialDate: null,
  finalDate: null,
  description: null,
  modality: null,
  typeEntry: null,
  segment: null,
  initialValue: 0,
  finalValue: 0,
  isFiltered: false,
};
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
  isFiltered,
  setIsFiltered,
}: IFilter) {
  const { user } = React.useContext(UserContext);
  const { alert, setAlert } = React.useContext(AlertContext);
  const [filter, setFilter] = React.useState(defaultFilter);
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

    empty(false);
    setLoading(true);
    let baseQuery: firebase.firestore.Query = firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(modality!);

    if (description) {
      baseQuery = baseQuery.where("description", "==", description);
    }
    if (segment) {
      baseQuery = baseQuery.where("segment", "==", segment);
    }
    if (typeEntry) {
      baseQuery = baseQuery.where("type", "==", typeEntry);
    }

    /**
     * O Firebase não permite realizar a query filtrando por data e valor, retornando um erro.
     * Sendo assim, caso o usuário tenha filtrado pelos dois, na query retornamos somente com filtro por data, e pelo código, é filtrado se os valores estão dentro do filtrado.
     */
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

    if (initialLabel > 0 && !initialdate) {
      baseQuery = baseQuery.where("value", ">=", initialLabel);
    }
    if (finalLabel > 0 && !finaldate) {
      baseQuery = baseQuery.where("value", "<=", finalLabel);
    }

    baseQuery.onSnapshot((snapshot) => {
      setList([]);
      if (snapshot.docs.length > 0) {
        let add = 0;
        snapshot.forEach((result) => {
          if (
            (initialLabel > 0 || finalLabel > 0) &&
            (initialdate || finaldate)
          ) {
            const { value } = result.data();
            if (initialLabel > 0 && finalLabel === 0) {
              if (value >= initialLabel) {
                setList((oldArray: any) => [...oldArray, result.data()]);
                add++;
              }
            } else if (finalLabel > 0 && initialLabel === 0) {
              if (value <= finalLabel) {
                setList((oldArray: any) => [...oldArray, result.data()]);
                add++;
              }
            } else {
              if (value >= initialLabel && value <= finalLabel) {
                setList((oldArray: any) => [...oldArray, result.data()]);
                add++;
              }
            }
          } else {
            setList((oldArray: any) => [...oldArray, result.data()]);
            add++;
          }
        });

        if (add === 0) {
          empty(true);
        }
      } else {
        empty(true);
      }
    });

    setFilter(() => ({
      description: description,
      modality: modality,
      segment: segment,
      typeEntry: typeEntry,
      initialDate: initialdate,
      finalDate: finaldate,
      initialValue: initialLabel,
      finalValue: finalLabel,
      isFiltered: true,
    }));
    setLoading(false);
    setIsFiltered(true);
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

    if (!isFiltered) {
      setFilter(() => ({
        ...defaultFilter,
      }));
    }
  }, [visible, isFiltered]);

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
