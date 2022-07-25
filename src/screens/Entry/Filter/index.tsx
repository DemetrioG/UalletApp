import * as React from "react";
import { ScrollView, Modal } from "react-native";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Picker from "../../../components/Picker";
import Alert from "../../../components/Alert";
import TextInput from "../../../components/TextInput";
import { AlertContext } from "../../../context/Alert/alertContext";
import { dateValidation } from "../../../utils/date.helper";
import { numberToReal, realToNumber } from "../../../utils/number.helper";
import { defaultFilter, IActiveFilter } from "./helper";
import { ButtonText, ModalContainer, ModalView } from "../../../styles/general";
import {
  ButtonContainer,
  HalfContainer,
  SpaceContainer,
  Title,
} from "./styles";
import { metrics } from "../../../styles";
import Icon from "../../../components/Icon";

interface IForm {
  initialdate: string;
  finaldate: string;
  description: string;
  initialvalue: string;
  finalvalue: string;
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

const Filter = ({
  route: { params },
}: {
  route: { params: IActiveFilter };
}) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { setAlert } = React.useContext(AlertContext);
  const [loading, setLoading] = React.useState(false);
  const [typeEntry, setTypeEntry] = React.useState<string | null>(null);
  const [typeEntryVisible, setTypeEntryVisible] = React.useState(false);
  const [modality, setModality] = React.useState<string | null>(null);
  const [modalityVisible, setModalityVisible] = React.useState(false);
  const [segment, setSegment] = React.useState<string | null>(null);
  const [segmentVisible, setSegmentVisible] = React.useState(false);
  const [filter, setFilter] = React.useState<IActiveFilter>(defaultFilter);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function handleClose() {
    navigate("Lançamentos", filter);
  }

  async function handleFilter({
    description,
    initialdate,
    finaldate,
    initialvalue,
    finalvalue,
  }: IForm) {
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

    setLoading(true);
    const data = {
      description: description,
      modality: modality,
      segment: segment !== "Todos" ? segment : null,
      typeEntry: typeEntry !== "Todos" ? typeEntry : null,
      initialDate: initialdate,
      finalDate: finaldate,
      initialValue: initialvalue ? realToNumber(initialvalue) : 0,
      finalValue: finalvalue ? realToNumber(finalvalue) : 0,
      isFiltered: true,
    };

    setFilter(data);
    navigate("Lançamentos", data);
    return setLoading(false);
  }

  React.useEffect(() => {
    setFilter(params);
    setValue("initialdate", params.initialDate!);
    setValue("finaldate", params.finalDate!);
    setValue("description", params.description!);
    setModality(params.modality);
    setTypeEntry(params.typeEntry);
    setSegment(params.segment);

    params.initialValue !== 0 &&
      setValue("initialvalue", numberToReal(params.initialValue!));

    params.finalValue !== 0 &&
      setValue("finalvalue", numberToReal(params.finalValue!));
  }, []);

  return (
    <Modal visible={true} onRequestClose={handleClose} transparent>
      <Alert />
      <ModalContainer>
        <ModalView>
          <SpaceContainer>
            <Title>Filtros</Title>
            <Icon name="x" onPress={handleClose} />
          </SpaceContainer>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: metrics.baseMargin }}
          >
            <SpaceContainer>
              <HalfContainer>
                <TextInput
                  name="initialdate"
                  placeholder="Data Inicial *"
                  control={control}
                  errors={errors.initialdate}
                  maxLength={10}
                  masked="datetime"
                />
              </HalfContainer>
              <HalfContainer>
                <TextInput
                  name="finaldate"
                  placeholder="Data Final *"
                  control={control}
                  errors={errors.finaldate}
                  maxLength={10}
                  masked="datetime"
                />
              </HalfContainer>
            </SpaceContainer>
            <TextInput
              name="description"
              placeholder="Descrição"
              control={control}
            />
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
            <SpaceContainer>
              <HalfContainer>
                <TextInput
                  name="initialvalue"
                  placeholder="Valor inicial"
                  control={control}
                  masked="money"
                />
              </HalfContainer>
              <HalfContainer>
                <TextInput
                  name="finalvalue"
                  placeholder="Valor final"
                  control={control}
                  masked="money"
                />
              </HalfContainer>
            </SpaceContainer>
          </ScrollView>
          <ButtonContainer>
            <Button isLoading={loading} onPress={handleSubmit(handleFilter)}>
              <ButtonText>APLICAR</ButtonText>
            </Button>
          </ButtonContainer>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default Filter;
