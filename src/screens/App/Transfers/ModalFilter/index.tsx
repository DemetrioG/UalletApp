import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { Modal } from "../../../../components/Modal";
import { ChevronLeft, Filter, FilterX } from "lucide-react-native";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { FormTextInputCalendar } from "../../../../components/Inputs/TextInputCalendar";
import { FormTextInput } from "../../../../components/Inputs/TextInput";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import { FilterFields, ModalFilterProps } from "./types";
import When from "../../../../components/When";
import { sleep } from "../../../../utils/query.helper";
import { FormFetchableSelectInputAccount } from "../../../../components/Inputs/FetchableSelectInputAccount";
import { StyledKeyboardAvoidingView } from "../../../../styles/general";

const defaultValues: FilterFields = {
  client: {
    initial_value: null,
    final_value: null,
  },
  server: {
    initial_date: null,
    final_date: null,
    origin_account: null,
    destination_account: null,
  },
};

export const ModalFilter = (props: ModalFilterProps) => {
  const { filterMethods, hasFilter } = props;
  const { theme }: IThemeProvider = useTheme();

  function handleSubmit() {
    props.onSubmit && props.onSubmit();
    return props.onClose();
  }

  return (
    <Modal {...props} ModalProps={{ swipeDirection: "down" }}>
      <StyledKeyboardAvoidingView>
        <HStack justifyContent="space-between">
          <HStack alignItems="center" space={3} mb={6}>
            <Pressable onPress={props.onClose}>
              <ChevronLeft color={theme?.text} />
            </Pressable>
            <Text fontWeight={700}>Filtros</Text>
          </HStack>
          <VStack>
            <When is={hasFilter}>
              <Pressable
                onPress={async () => {
                  filterMethods.reset(defaultValues);
                  await sleep(100);
                  handleSubmit();
                }}
              >
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
                  setDateOnOpen
                />
              </VStack>
              <VStack w="48%">
                <FormTextInputCalendar
                  placeholder="Data final"
                  name="server.final_date"
                  control={filterMethods.control}
                  formMethods={filterMethods}
                  withIcon={false}
                  setDateOnOpen
                />
              </VStack>
            </HStack>
            <FormFetchableSelectInputAccount
              name="server.origin_account"
              placeholder="Conta de origem"
              control={filterMethods.control}
            />
            <FormFetchableSelectInputAccount
              name="server.destination_account"
              placeholder="Conta de destino"
              control={filterMethods.control}
            />
            <HStack w="100%" justifyContent="space-between">
              <VStack w="48%">
                <FormTextInput
                  placeholder="Valor inicial"
                  name="client.initial_value"
                  masked="money"
                  control={filterMethods.control}
                  withIcon={false}
                />
              </VStack>
              <VStack w="48%">
                <FormTextInput
                  placeholder="Valor final"
                  name="client.final_value"
                  masked="money"
                  control={filterMethods.control}
                  withIcon={false}
                />
              </VStack>
            </HStack>
          </Center>
        </TouchableWithoutFeedback>
        <Button onPress={handleSubmit}>
          <Text fontWeight="bold" color="white">
            Aplicar
          </Text>
        </Button>
      </StyledKeyboardAvoidingView>
    </Modal>
  );
};
