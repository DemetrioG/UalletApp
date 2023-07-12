import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { Modal } from "../../../../components/Modal";
import { ChevronLeft, Filter, FilterX } from "lucide-react-native";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { FormTextInputCalendar } from "../../../../components/Inputs/TextInputCalendar";
import { FormTextInput } from "../../../../components/Inputs/TextInput";
import { FormSelectInputModality } from "../../../../components/Inputs/SelectInputModality";
import { FormSelectInputSegment } from "../../../../components/Inputs/SelectInputSegment";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import { ModalFilterProps } from "./types";
import { FormSelectInputType } from "../../../../components/Inputs/SelectInputType";
import When from "../../../../components/When";

export const ModalFilter = (props: ModalFilterProps) => {
  const { filterMethods, hasFilter } = props;
  const { theme }: IThemeProvider = useTheme();

  return (
    <Modal {...props}>
      <HStack justifyContent="space-between">
        <HStack alignItems="center" space={3} mb={6}>
          <Pressable onPress={props.onClose}>
            <ChevronLeft color={theme?.text} />
          </Pressable>
          <Text fontWeight={700}>Filtros</Text>
        </HStack>
        <VStack>
          <When is={hasFilter}>
            <Pressable onPress={() => filterMethods.reset({})} borderWidth={1}>
              <FilterX color={theme?.blue} />
            </Pressable>
          </When>
          <When is={!hasFilter}>
            <Filter color={theme?.text} />
          </When>
        </VStack>
      </HStack>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Center flex={1}>
          <HStack w="100%" justifyContent="space-between">
            <VStack w="48%">
              <FormTextInputCalendar
                placeholder="Data inicial"
                name="server.initial_date"
                control={filterMethods.control}
                formMethods={filterMethods}
                withIcon={false}
              />
            </VStack>
            <VStack w="48%">
              <FormTextInputCalendar
                placeholder="Data final"
                name="server.final_date"
                control={filterMethods.control}
                formMethods={filterMethods}
                withIcon={false}
              />
            </VStack>
          </HStack>
          <FormTextInput
            placeholder="Descrição"
            name="client.description"
            control={filterMethods.control}
          />
          <FormSelectInputType
            name="server.type"
            control={filterMethods.control}
          />
          <FormSelectInputModality
            name="server.modality"
            control={filterMethods.control}
          />
          <FormSelectInputSegment
            name="server.segment"
            control={filterMethods.control}
          />
          <HStack w="100%" justifyContent="space-between">
            <VStack w="48%">
              <FormTextInput
                placeholder="Valor inicial"
                name="server.initial_value"
                masked="money"
                control={filterMethods.control}
                withIcon={false}
              />
            </VStack>
            <VStack w="48%">
              <FormTextInput
                placeholder="Valor final"
                name="server.final_value"
                masked="money"
                control={filterMethods.control}
                withIcon={false}
              />
            </VStack>
          </HStack>
        </Center>
      </TouchableWithoutFeedback>
      <Button
        onPress={() => {
          props.onSubmit && props.onSubmit();
          props.onClose();
        }}
      >
        <Text fontWeight="bold" color="white">
          Aplicar
        </Text>
      </Button>
    </Modal>
  );
};
