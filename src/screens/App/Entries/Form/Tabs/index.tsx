import { useEffect } from "react";
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { FormTextInput } from "../../../../../components/Inputs/TextInput";
import { Center } from "native-base";
import { useFormContext } from "react-hook-form";
import When from "../../../../../components/When";
import { FormSelectInput } from "../../../../../components/Inputs/SelectInput";
import { TEntrieType } from "../../../../../types/types";
import { FormTextInputCalendar } from "../../../../../components/Inputs/TextInputCalendar";
import { NewEntrieDTO } from "../../types";
import { IRoutes } from "../../../../../components/TabView";
import { FormSelectInputModality } from "../../../../../components/Inputs/SelectInputModality";
import { FormSelectInputSegment } from "../../../../../components/Inputs/SelectInputSegment";

export const FormEntriesTab = ({
  route,
  activeTab,
}: {
  route: IRoutes;
  activeTab: IRoutes;
}) => {
  const formMethods = useFormContext<NewEntrieDTO>();

  useEffect(() => {
    formMethods.setValue("type", activeTab.key as TEntrieType);
  }, [activeTab.key]);

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
        <FormSelectInputModality
          name="modality"
          control={formMethods.control}
          variant="filled"
          errors={formMethods.formState.errors.modality}
          isRequired
        />
        <When is={route.key === "Despesa"}>
          <FormSelectInputSegment
            name="segment"
            control={formMethods.control}
            variant="filled"
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
