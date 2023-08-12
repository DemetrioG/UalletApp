import { useEffect } from "react";
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { FormTextInput } from "../../../../../components/Inputs/TextInput";
import { Center, HStack, Pressable, ScrollView, Text } from "native-base";
import { useFormContext, useWatch } from "react-hook-form";
import When from "../../../../../components/When";
import { TEntrieType } from "../../../../../types/types";
import { FormTextInputCalendar } from "../../../../../components/Inputs/TextInputCalendar";
import { NewEntrieDTO } from "../../types";
import { FormSelectInputModality } from "../../../../../components/Inputs/SelectInputModality";
import { RouteProps } from "../../../../../components/TabView/types";
import Tooltip from "../../../../../components/Tooltip";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { InfoIcon } from "lucide-react-native";
import { FormSwitchInput } from "../../../../../components/Inputs/SwitchInput";
import { FormSelectInputMonthQuantity } from "../../../../../components/Inputs/SelectInputMonthQuantity";
import { FormFetchableSelectInputSegment } from "../../../../../components/Inputs/FetchableSelectInputSegment";

export const FormEntriesTab = ({
  route,
  activeTab,
}: {
  route: RouteProps;
  activeTab: RouteProps;
}) => {
  const formMethods = useFormContext<NewEntrieDTO>();
  const { theme }: IThemeProvider = useTheme();
  const recurrent = useWatch({
    name: "recurrent",
    control: formMethods.control,
  });

  useEffect(() => {
    formMethods.setValue("type", activeTab.key as TEntrieType);
  }, [activeTab.key]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <Center flex={1} paddingY={5}>
          <FormTextInputCalendar
            variant="filled"
            name="date"
            placeholder="Data lançamento"
            formMethods={formMethods}
            control={formMethods.control}
            errors={formMethods.formState.errors.date}
            setDateOnOpen={!activeTab.isEditing}
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
            <FormFetchableSelectInputSegment
              name="segment"
              control={formMethods.control}
              variant="filled"
              errors={formMethods.formState.errors.segment}
            />
          </When>
          <When is={!!recurrent && !activeTab.isEditing}>
            <FormSelectInputMonthQuantity
              variant="filled"
              name="quantity"
              control={formMethods.control}
              errors={formMethods.formState.errors.quantity}
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
          <When is={!activeTab.isEditing}>
            <HStack w="full" alignItems="center" space={2}>
              <Text>Lançamento recorrente</Text>
              <FormSwitchInput control={formMethods.control} name="recurrent" />
              <Pressable>
                <Tooltip label="O lançamento será replicado pela quantidade de meses escolhida">
                  <InfoIcon color={theme?.text} />
                </Tooltip>
              </Pressable>
            </HStack>
          </When>
        </Center>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
