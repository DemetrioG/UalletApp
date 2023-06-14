import * as React from "react";
import { ScrollView, Modal } from "react-native";
import { Button, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Picker from "../../../../components/Picker";
import TextInput from "../../../../components/TextInput";
import Icon from "../../../../components/Icon";
import { dateValidation } from "@utils/date.helper";
import { numberToReal, realToNumber } from "@utils/number.helper";
import { defaultFilter, IActiveFilter } from "./helper";
import {
  ButtonText,
  HalfContainer,
  ModalContainer,
  ModalView,
} from "../../../../styles/general";
import { ButtonContainer, SpaceContainer } from "./styles";
import { metrics } from "../../../../styles";
import {
  ENTRY_SEGMENT,
  ENTRY_TYPE,
  MODALITY,
} from "../../../../components/Picker/options";

interface IForm {
  initialdate: string;
  finaldate: string;
  description: string;
  modality: string;
  segment: string;
  entry_type: string;
  initialvalue: string;
  finalvalue: string;
}

const Filter = ({
  route: { params },
}: {
  route: { params: IActiveFilter };
}) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const [loading, setLoading] = React.useState(false);
  const [typeEntry, setTypeEntry] = React.useState<string | null>(null);
  const [typeEntryVisible, setTypeEntryVisible] = React.useState(false);
  const [modality, setModality] = React.useState<string | null>(null);
  const [modalityVisible, setModalityVisible] = React.useState(false);
  const [segment, setSegment] = React.useState<string | null>(null);
  const [segmentVisible, setSegmentVisible] = React.useState(false);
  const [filter, setFilter] = React.useState<IActiveFilter>(defaultFilter);

  const schema = yup
    .object({
      initialdate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      finaldate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      modality: yup
        .string()
        .test("modality", "Informe a modalidade", () => Boolean(modality!)),
      segment: yup.string(),
      entry_type: yup.string(),
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

  function handleClose() {
    navigate("Lancamentos", filter);
  }

  async function handleFilter({
    description,
    initialdate,
    finaldate,
    initialvalue,
    finalvalue,
  }: IForm) {
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
    navigate("Lancamentos", data);
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
      <ModalContainer>
        <ModalView>
          <SpaceContainer>
            <Text fontSize={"md"} fontWeight={700}>
              Filtros
            </Text>
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
                  placeholder="Data Inicial"
                  control={control}
                  errors={errors.initialdate}
                  maxLength={10}
                  masked="datetime"
                />
              </HalfContainer>
              <HalfContainer>
                <TextInput
                  name="finaldate"
                  placeholder="Data Final"
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
              options={MODALITY}
              selectedValue={setModality}
              value={!modality ? "Modalidade" : modality}
              type="Modalidade"
              visibility={modalityVisible}
              setVisibility={setModalityVisible}
              errors={errors.modality}
            />
            <Picker
              options={ENTRY_TYPE}
              selectedValue={setTypeEntry}
              value={!typeEntry ? "Tipo" : typeEntry}
              type="Tipo"
              visibility={typeEntryVisible}
              setVisibility={setTypeEntryVisible}
              errors={errors.entry_type}
            />
            {typeEntry !== "Receita" && (
              <Picker
                options={["Todos", ...ENTRY_SEGMENT]}
                selectedValue={setSegment}
                value={!segment ? "Segmento" : segment}
                type="Segmento"
                visibility={segmentVisible}
                setVisibility={setSegmentVisible}
                errors={errors.segment}
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
