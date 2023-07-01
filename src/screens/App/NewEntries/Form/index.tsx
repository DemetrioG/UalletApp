import { useNavigation } from "@react-navigation/native";
import { ListEntries } from "../../Entries/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ConfirmContext } from "../../../../context/ConfirmDialog/confirmContext";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../../context/Data/dataContext";
import {
  convertDate,
  convertDateFromDatabase,
} from "../../../../utils/date.helper";
import { Keyboard } from "react-native";
import { NewEntrieDTO } from "../types";
import { TEntrieType } from "../../../../types/types";
import { deleteEntry, registerNewEntry, updateEntry } from "../query";
import Toast from "react-native-toast-message";
import { numberToReal } from "../../../../utils/number.helper";
import { TouchableWithoutFeedback } from "react-native";
import {
  ButtonDelete,
  ButtonText,
  ContainerCenter,
  FormContainer,
} from "../../../../styles/general";
import TextInput from "../../../../components/TextInput";
import Picker from "../../../../components/Picker";
import { Button, Text } from "native-base";
import Calendar from "../../../../components/Calendar";
import { useFormContext } from "react-hook-form";
import When from "../../../../components/When";

export const NewEntrieForm = ({
  params,
  route: { key: type },
}: {
  params: ListEntries;
  route: { key: string };
}) => {
  const id = params?.id;
  const formMethods = useFormContext();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { setConfirm } = useContext(ConfirmContext);
  const {
    data: { modality },
  } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [classification, setClassification] = useState<string | null>(null);
  const [classificationVisible, setClassificationVisible] = useState(false);
  const [segment, setSegment] = useState<string | null>(null);
  const [segmentVisible, setSegmentVisible] = useState(false);
  const [calendar, setCalendar] = useState(false);

  function setDateToInput(date: Date) {
    formMethods.setValue("entrydate", convertDate(date));
  }

  async function submitRegister(
    { description, entrydate, value }: NewEntrieDTO,
    idRegister?: number
  ) {
    Keyboard.dismiss();
    setIsLoading(true);

    const data = {
      description: description,
      entrydate: entrydate,
      value: value,
      modality: modality,
      classification: classification!,
      segment: segment!,
      type: type as TEntrieType,
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

  useEffect(() => {
    /**
     * Verifica se é Edição e preenche os dados nos campos
     */
    if (params) {
      setClassification(params.classification);
      setSegment(params.segment || null);
      formMethods.setValue("entrydate", convertDateFromDatabase(params.date));
      formMethods.setValue("description", params.description);
      formMethods.setValue("value", numberToReal(params.value));
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <ContainerCenter>
          <TextInput
            variant="filled"
            name="entrydate"
            placeholder="Data lançamento"
            control={formMethods.control}
            errors={formMethods.formState.errors.entrydate}
            masked="datetime"
            maxLength={10}
            setCalendar={setCalendar}
            withIcon
            helperText="Verifique a data informada"
          />
          <TextInput
            variant="filled"
            name="description"
            placeholder="Descrição"
            control={formMethods.control}
            errors={formMethods.formState.errors.description}
            maxLength={40}
          />
          {/* {type == "Despesa" && (
            <>
              <Picker
                options={CLASSIFICATION}
                selectedValue={setClassification}
                value={!classification ? "Classificação" : classification}
                type="Classificação"
                visibility={classificationVisible}
                setVisibility={setClassificationVisible}
                errors={errors.classification}
              />
              <Picker
                options={ENTRY_SEGMENT}
                selectedValue={setSegment}
                value={!segment ? "Segmento" : segment}
                type="Segmento"
                visibility={segmentVisible}
                setVisibility={setSegmentVisible}
                errors={errors.segment}
              />
            </>
          )} */}
          <TextInput
            variant="filled"
            name="value"
            placeholder="Valor"
            control={formMethods.control}
            errors={formMethods.formState.errors}
            masked="money"
            helperText="Informe todos os campos"
          />
        </ContainerCenter>
        <When is={!id}>
          <Button
            isLoading={isLoading}
            onPress={formMethods.handleSubmit((e) => submitRegister(e))}
          >
            <ButtonText>Cadastrar</ButtonText>
          </Button>
        </When>
        <When is={!!id}>
          <>
            <Button
              isLoading={isLoading}
              isDisabled={isDelete}
              onPress={formMethods.handleSubmit((e) =>
                submitRegister(e, params.id)
              )}
            >
              <ButtonText>Atualizar</ButtonText>
            </Button>
            <Button
              variant="outline"
              isLoading={isDelete}
              isDisabled={isLoading}
              onPress={handleDelete}
            >
              <ButtonText>Excluir</ButtonText>
            </Button>
          </>
        </When>
        {/* {type === "Despesa" && !isEditing && (
          <VStack alignItems="center" pb={5}>
            <TouchableOpacity
              onPress={() => navigate("Lancamentos/LancamentoFixo")}
            >
              <FixEntryText>CADASTRAR DESPESAS FIXAS</FixEntryText>
            </TouchableOpacity>
          </VStack>
        )} */}
        <Calendar
          date={new Date()}
          setDateToInput={setDateToInput}
          calendarIsShow={calendar}
          edit={!!id}
        />
      </>
    </TouchableWithoutFeedback>
  );
};
