import * as React from "react";
import { ScrollView, View, Modal } from "react-native";
import { Button, Select } from "native-base";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../../services/firebase";
import Picker from "../../../components/Picker";
import Alert from "../../../components/Alert";
import TextInput from "../../../components/TextInput";
import { IActiveFilter } from "..";
import { UserContext } from "../../../context/User/userContext";
import { AlertContext } from "../../../context/Alert/alertContext";
import { DateContext } from "../../../context/Date/dateContext";
import { dateValidation } from "../../../utils/date.helper";
import { numberToReal } from "../../../utils/number.helper";
import {
  ButtonText,
  Icon,
  ModalContainer,
  ModalView,
  StyledLoading,
  StyledSlider,
} from "../../../styles/general";
import {
  ButtonContainer,
  InputContainer,
  InputDateContainer,
  LabelContainer,
  LabelText,
  LabelValue,
  SpaceContainer,
  Title,
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

const schema = yup
  .object({
    initialdate: yup.string().required().min(10),
    finaldate: yup.string().required().min(10),
  })
  .required();

export default function Filter(
  {
    // visible,
    // setVisible,
    // type,
    // filter,
    // setFilter,
  }
) {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = React.useContext(UserContext);
  const { date } = React.useContext(DateContext);
  const { alert, setAlert } = React.useContext(AlertContext);
  const [visible, setVisible] = React.useState(true);
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

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function handleClose() {
    navigate("Lançamentos");
  }

  async function handleFilter({ description, initialdate, finaldate }: IForm) {
    if (!dateValidation(initialdate) || !dateValidation(finaldate)) {
      return setAlert(() => ({
        type: "error",
        title: "Verifique o período informado",
        visibility: true,
      }));
    }
    if (!modality) {
      return setAlert(() => ({
        type: "error",
        title: "Informe a modalidade",
        visibility: true,
      }));
    }
    return;

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
      .collection(date.modality)
      .orderBy("value", "desc")
      .limit(1)
      .get()
      .then((v) => {
        v.forEach((result) => {
          const { value } = result.data();
          maxValue = value || 0;
        });
      });

    if (maxValue > 0) {
      setMaxValue(maxValue);
    } else {
      setMaxValue(100);
    }
  }

  // React.useEffect(() => {
  //   if (visible) {
  //     setValue("initialdate", filter.initialDate!);
  //     setValue("finaldate", filter.finalDate!);
  //     setValue("description", filter.description!);
  //     setInitialLabel(filter.initialValue);
  //     setFinalLabel(filter.finalValue);
  //     setIsSliding(false);
  //     getMaxValue();
  //   }
  // }, [visible]);

  // React.useEffect(() => {
  //   if (!filter.isFiltered) {
  //     setTypeEntry(null);
  //     setModality(null);
  //     setSegment(null);
  //   }
  // }, [filter]);

  return (
    <Modal visible={true} onRequestClose={handleClose} transparent>
      <Alert />
      <ModalContainer>
        <ModalView>
          <SpaceContainer>
            <Title>Filtros</Title>
            <Icon name="x" onPress={handleClose} />
          </SpaceContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputContainer>
              <SpaceContainer>
                <InputDateContainer>
                  <TextInput
                    name="initialdate"
                    placeholder="Data Inicial *"
                    control={control}
                    errors={errors.initialdate}
                    maxLength={10}
                    datetime
                  />
                </InputDateContainer>
                <InputDateContainer>
                  <TextInput
                    name="finaldate"
                    placeholder="Data Final *"
                    control={control}
                    errors={errors.finaldate}
                    maxLength={10}
                    datetime
                  />
                </InputDateContainer>
              </SpaceContainer>
            </InputContainer>
            <InputContainer>
              <TextInput
                name="description"
                placeholder="Descrição"
                control={control}
              />
            </InputContainer>
            <Select placeholder="Modalidade *">
              <Select.Item label="Projetado" value="projetado" />
              <Select.Item label="Real" value="real" />
            </Select>
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
            {/* <View>
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
            </View> */}
          </ScrollView>
          <ButtonContainer>
            <Button onPress={handleSubmit(handleFilter)}>
              {loading ? <StyledLoading /> : <ButtonText>APLICAR</ButtonText>}
            </Button>
          </ButtonContainer>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
}
