import { ListEntries } from "../../Entries/types";
import { useEffect } from "react";
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { FormTextInput } from "../../../../components/Inputs/TextInput";
import { Center } from "native-base";
import { useFormContext } from "react-hook-form";
import When from "../../../../components/When";
import { FormSelectInput } from "../../../../components/SelectInput";
import { TEntrieType } from "../../../../types/types";
import { FormTextInputCalendar } from "../../../../components/Inputs/TextInputCalendar";
import { NewEntrieDTO } from "../types";

export const NewEntrieForm = ({
  route: { key: type },
}: {
  route: { key: string };
}) => {
  const formMethods = useFormContext<NewEntrieDTO>();

  useEffect(() => {
    formMethods.setValue("type", type as TEntrieType);
  }, [type]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Center flex={1}>
        <FormTextInputCalendar
          variant="filled"
          name="date"
          placeholder="Data lançamento"
          formMethods={formMethods}
          control={formMethods.control}
          errors={formMethods.formState.errors.date}
          isRequired
        />
        <FormTextInput
          variant="filled"
          name="description"
          placeholder="Descrição"
          control={formMethods.control}
          errors={formMethods.formState.errors.description}
          maxLength={40}
          isRequired
        />
        <FormSelectInput
          name="modality"
          control={formMethods.control}
          options={schemaOptions}
          variant="filled"
          placeholder="Modalidade"
          errors={formMethods.formState.errors.modality}
          isRequired
        />
        <When is={type === "Despesa"}>
          <FormSelectInput
            name="segment"
            control={formMethods.control}
            options={segmentOptions}
            variant="filled"
            placeholder="Segmento"
            errors={formMethods.formState.errors.segment}
          />
        </When>
        <FormTextInput
          variant="filled"
          name="value"
          placeholder="Valor"
          control={formMethods.control}
          errors={formMethods.formState.errors}
          masked="money"
          helperText="Informe todos os campos"
          isRequired
        />
      </Center>
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
