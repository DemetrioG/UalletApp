import { useNavigation } from "@react-navigation/native";
import { ListEntries } from "../../Entries/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ConfirmContext } from "../../../../context/ConfirmDialog/confirmContext";
import { useContext, useEffect, useState } from "react";
import {
  convertDate,
  convertDateFromDatabase,
} from "../../../../utils/date.helper";
import { Keyboard } from "react-native";
import { NewEntrieDTO } from "../types";
import { TEntrieType } from "../../../../types/types";
import { registerNewEntry, updateEntry } from "../query";
import Toast from "react-native-toast-message";
import { numberToReal } from "../../../../utils/number.helper";
import { TouchableWithoutFeedback } from "react-native";
import TextInput from "../../../../components/TextInput";
import { Button, Center, Text } from "native-base";
import Calendar from "../../../../components/Calendar";
import { useFormContext } from "react-hook-form";
import When from "../../../../components/When";
import { SelectInput } from "../../../../components/SelectInput";
import { DataContext } from "../../../../context/Data/dataContext";
import { useHandleConfirmDeleteEntrie } from "../hooks/useEntries";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";

export const NewEntrieForm = ({
  params,
  route: { key: type },
}: {
  params: ListEntries;
  route: { key: string };
}) => {
  const id = params?.id;
  const formMethods = useFormContext();
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { data } = useContext(DataContext);

  const { isLoading: isLoadingDelete, handleDelete } =
    useHandleConfirmDeleteEntrie();

  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
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

  useEffect(() => {
    /**
     * Verifica se é Edição e preenche os dados nos campos
     */
    if (params) {
      formMethods.setValue("entrydate", convertDateFromDatabase(params.date));
      formMethods.setValue("description", params.description);
      formMethods.setValue("value", numberToReal(params.value));
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Center flex={1}>
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
          <SelectInput
            options={schemaOptions}
            variant="filled"
            placeholder="Modalidade"
            defaultValue={data.modality}
          />
          <When is={type === "Despesa"}>
            <SelectInput
              options={segmentOptions}
              variant="filled"
              placeholder="Segmento"
            />
          </When>
          <TextInput
            variant="filled"
            name="value"
            placeholder="Valor"
            control={formMethods.control}
            errors={formMethods.formState.errors}
            masked="money"
            helperText="Informe todos os campos"
          />
        </Center>
        <When is={!id}>
          <Button
            isLoading={isLoading}
            onPress={formMethods.handleSubmit((e) => submitRegister(e))}
          >
            <Text fontWeight="bold">Cadastrar</Text>
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
              <Text fontWeight="bold">Atualizar</Text>
            </Button>
            <Button
              variant="outline"
              isLoading={isDelete}
              isDisabled={isLoadingDelete}
              onPress={() => handleDelete(params)}
            >
              <Text fontWeight="bold" color={theme?.blue}>
                Excluir
              </Text>
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

const schemaOptions = [
  { value: "Real", label: "Real" },
  { value: "Projetado", label: "Projetado" },
];

const segmentOptions = [
  { value: "Lazer", label: "Lazer" },
  { value: "Educação", label: "Educação" },
  { value: "Investimentos", label: "Investimentos" },
  { value: "Necessidades", label: "Necessidades" },
  { value: "Curto e médio prazo", label: "Curto e médio prazo" },
];
