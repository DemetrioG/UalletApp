import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { IEntryList } from "../Entry";
import Picker from "../../components/Picker";
import Calendar from "../../components/Calendar";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import { ENTRY_SEGMENT, MODALITY } from "../../components/Picker/options";
import { ConfirmContext } from "../../context/ConfirmDialog/confirmContext";
import {
  dateValidation,
  convertDate,
  convertDateFromDatabase,
} from "../../utils/date.helper";
import { numberToReal } from "../../utils/number.helper";
import { HorizontalView, TypeText, TypeView } from "./styles";
import {
  ButtonOutlineText,
  ButtonText,
  ContainerCenter,
  FormContainer,
  ButtonOutline,
  TextHeaderScreen,
  ViewTabContent,
  ButtonDelete,
  BackgroundContainer,
  ViewTab,
} from "../../styles/general";
import { deleteEntry, INewEntry, registerNewEntry, updateEntry } from "./query";

interface IForm {
  entrydate: string;
  description: string;
  modality: string;
  segment: string;
  value: string;
}

const NewEntry = ({ route: { params } }: { route: { params: IEntryList } }) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { setConfirm } = React.useContext(ConfirmContext);

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

  const schema = yup
    .object({
      entrydate: yup
        .string()
        .required()
        .min(10)
        .test("date", "Verifique a data informada", (value) =>
          dateValidation(value!)
        ),
      description: yup.string().required(),
      modality: yup
        .string()
        .test("modality", "Informe a modalidade", () => Boolean(modality!)),
      segment: yup
        .string()
        .test("segment", "Informe o segmento", () =>
          type === "Despesa" ? Boolean(segment!) : true
        ),
      value: yup.string().required(),
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

  function setDateToInput(date: Date) {
    setValue("entrydate", convertDate(date));
  }

  async function submitRegister(
    { description, entrydate, value }: IForm,
    idRegister?: number
  ) {
    Keyboard.dismiss();
    setIsLoading(true);

    const data: INewEntry = {
      description: description,
      entrydate: entrydate,
      value: value,
      modality: modality!,
      segment: segment!,
      type: type!,
    };

    if (!idRegister) {
      registerNewEntry(data)
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Dados cadastrados com sucesso",
          });
          navigate("Lancamentos");
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Erro ao cadastrar as informações",
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      updateEntry(data, idRegister, params)
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Lançamento atualizado com sucesso",
          });
          navigate("Lancamentos");
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Erro ao atualizar as informações",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }

  function handleDelete() {
    return setConfirm(() => ({
      title: "Deseja excluir este lançamento?",
      visibility: true,
      callbackFunction: submitDelete,
    }));
  }

  async function submitDelete() {
    setIsDelete(true);
    deleteEntry(params)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Lançamento excluído com  sucesso",
        });
        navigate("Lancamentos");
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao excluir o lançamento",
        });
      })
      .finally(() => setIsDelete(false));
  }

  React.useEffect(() => {
    // Verifica se é Edição e preenche os dados nos campos
    if (params) {
      setIsEditing(true);
      setType(params.type);
      setModality(params.modality);
      setSegment(params.segment || null);
      setValue("entrydate", convertDateFromDatabase(params.date));
      setValue("description", params.description);
      setValue("value", numberToReal(params.value));
    }
  }, []);

  return (
    <BackgroundContainer>
      <ViewTab>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ViewTabContent noPaddingBottom>
            <HorizontalView>
              <Icon
                name="chevron-left"
                style={{ marginRight: 10 }}
                onPress={() => navigate("Lancamentos")}
              />
              <TextHeaderScreen noMarginBottom>
                {isEditing ? "Editar lançamento" : "Novo lançamento"}
              </TextHeaderScreen>
            </HorizontalView>
            <TypeView>
              <TypeText type={type}>{type}</TypeText>
              {!isEditing && (
                <Icon
                  name="refresh-cw"
                  size={16}
                  onPress={() =>
                    type == "Receita" ? setType("Despesa") : setType("Receita")
                  }
                />
              )}
            </TypeView>
            <ContainerCenter>
              <FormContainer insideApp>
                <TextInput
                  name="entrydate"
                  placeholder="Data lançamento"
                  control={control}
                  errors={errors.entrydate}
                  masked="datetime"
                  maxLength={10}
                  setCalendar={setCalendar}
                  withIcon
                  helperText="Verifique a data informada"
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
                  errors={errors.modality}
                />
                {type == "Despesa" && (
                  <Picker
                    options={ENTRY_SEGMENT}
                    selectedValue={setSegment}
                    value={!segment ? "Segmento" : segment}
                    type="Segmento"
                    visibility={segmentVisible}
                    setVisibility={setSegmentVisible}
                    errors={errors.segment}
                  />
                )}
                <TextInput
                  name="value"
                  placeholder="Valor"
                  control={control}
                  errors={errors}
                  masked="money"
                  helperText="Informe todos os campos"
                />
                {!isEditing && (
                  <>
                    <Button
                      isLoading={isLoading}
                      onPress={handleSubmit((e) => submitRegister(e))}
                    >
                      <ButtonText>CADASTRAR</ButtonText>
                    </Button>
                    <ButtonOutline
                      onPress={() => navigate("Lancamentos/LancamentoFixo")}
                    >
                      <ButtonOutlineText>
                        CADASTRAR DESPESAS FIXAS
                      </ButtonOutlineText>
                    </ButtonOutline>
                  </>
                )}
                {isEditing && (
                  <>
                    <Button
                      isLoading={isLoading}
                      isDisabled={isDelete}
                      onPress={handleSubmit((e) =>
                        submitRegister(e, params.id)
                      )}
                    >
                      <ButtonText>ATUALIZAR</ButtonText>
                    </Button>
                    <ButtonDelete
                      isLoading={isDelete}
                      isDisabled={isLoading}
                      onPress={handleDelete}
                    >
                      <ButtonText>EXCLUIR</ButtonText>
                    </ButtonDelete>
                  </>
                )}
              </FormContainer>
              <Calendar
                date={new Date()}
                setDateToInput={setDateToInput}
                calendarIsShow={calendar}
                edit={isEditing}
              />
            </ContainerCenter>
          </ViewTabContent>
        </TouchableWithoutFeedback>
      </ViewTab>
    </BackgroundContainer>
  );
};

export default NewEntry;
