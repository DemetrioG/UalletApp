import { ListEntries } from "../../Entries/types";
import { useContext, useEffect, useState } from "react";
import {
  convertDate,
  convertDateFromDatabase,
} from "../../../../utils/date.helper";
import { Keyboard } from "react-native";
import { numberToReal } from "../../../../utils/number.helper";
import { TouchableWithoutFeedback } from "react-native";
import TextInput from "../../../../components/TextInput";
import { Button, Center, Text } from "native-base";
import Calendar from "../../../../components/Calendar";
import { FormProvider, useFormContext } from "react-hook-form";
import When from "../../../../components/When";
import { SelectInput } from "../../../../components/SelectInput";
import { DataContext } from "../../../../context/Data/dataContext";
import {
  useFormEntries,
  useHandleConfirmDeleteEntrie,
} from "../hooks/useEntries";
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
  const { formMethods, isLoadingCreate, isLoadingUpdate, handleSubmit } =
    useFormEntries(params, id);
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);

  const { isLoading: isLoadingDelete, handleDelete } =
    useHandleConfirmDeleteEntrie();

  const [calendar, setCalendar] = useState(false);

  function setDateToInput(date: Date) {
    formMethods.setValue("entrydate", convertDate(date));
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
    <FormProvider {...formMethods}>
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
            <Button isLoading={isLoadingCreate} onPress={() => handleSubmit()}>
              <Text fontWeight="bold" color="white">
                Cadastrar
              </Text>
            </Button>
          </When>
          <When is={!!id}>
            <>
              <Button
                isLoading={isLoadingUpdate}
                isDisabled={isLoadingDelete}
                onPress={() => handleSubmit()}
              >
                <Text fontWeight="bold" color="white">
                  Atualizar
                </Text>
              </Button>
              <Button
                variant="outline"
                isLoading={isLoadingDelete}
                isDisabled={isLoadingUpdate}
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
    </FormProvider>
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
