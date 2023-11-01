import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { TransfersFormParams } from "../types";
import { useNavigation } from "@react-navigation/native";
import {
  useFormTransfer,
  useHandleConfirmDeleteTransfer,
} from "../hooks/useTransfers";
import { useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  BackgroundContainer,
  StyledKeyboardAvoidingView,
} from "../../../../styles/general";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { ChevronLeft } from "lucide-react-native";
import When from "../../../../components/When";
import { convertDateFromDatabase } from "../../../../utils/date.helper";
import { numberToReal } from "../../../../utils/number.helper";
import { FormTextInputCalendar } from "../../../../components/Inputs/TextInputCalendar";
import { FormFetchableSelectInputAccount } from "../../../../components/Inputs/FetchableSelectInputAccount";
import { FormTextInput } from "../../../../components/Inputs/TextInput";
import { format } from "date-fns";

export const TransfersForm = ({ route: { params } }: TransfersFormParams) => {
  const id = params?.id;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { formMethods, isLoadingCreate, isLoadingUpdate, handleSubmit } =
    useFormTransfer(id);
  const { isLoadingDelete, handleDelete } = useHandleConfirmDeleteTransfer();

  useEffect(() => {
    params &&
      formMethods.reset({
        ...params,
        date: convertDateFromDatabase(params.date),
        value: numberToReal(params.value),
      });
  }, []);

  useEffect(() => {
    formMethods.setValue("date", format(new Date(), "dd/MM/yyyy"));
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <StyledKeyboardAvoidingView>
        <BackgroundContainer>
          <VStack
            backgroundColor={theme?.secondary}
            flex={1}
            p={5}
            borderTopLeftRadius="30px"
            borderTopRightRadius="30px"
          >
            <HStack alignItems="center" space={3} mb={10}>
              <Pressable onPress={goBack}>
                <ChevronLeft color={theme?.text} />
              </Pressable>
              <Text fontWeight={700}>
                {!!id ? "Atualizar" : "Cadastrar"} Transferência
              </Text>
            </HStack>
            <Center flex={1}>
              <FormTextInputCalendar
                variant="filled"
                name="date"
                placeholder="Data lançamento"
                formMethods={formMethods}
                control={formMethods.control}
                errors={formMethods.formState.errors.date}
                setDateOnOpen={!id}
                isRequired
              />
              <FormFetchableSelectInputAccount
                name="originAccount"
                control={formMethods.control}
                variant="filled"
                errors={formMethods.formState.errors.originAccount}
                isRequired
                placeholder="Conta de origem"
                helperText={formMethods.formState.errors.originAccount?.message}
              />
              <FormFetchableSelectInputAccount
                name="destinationAccount"
                control={formMethods.control}
                variant="filled"
                errors={formMethods.formState.errors.destinationAccount}
                helperText={
                  formMethods.formState.errors.destinationAccount?.message
                }
                isRequired
                placeholder="Conta de destino"
              />
              <FormTextInput
                variant="filled"
                name="value"
                placeholder="Valor"
                control={formMethods.control}
                errors={formMethods.formState.errors.value}
                masked="money"
                isRequired
              />
            </Center>
            <When is={!id}>
              <Button onPress={handleSubmit} isLoading={isLoadingCreate}>
                <Text fontWeight="bold" color="white">
                  Cadastrar
                </Text>
              </Button>
            </When>
            <When is={!!id && formMethods.formState.isDirty}>
              <Button
                isLoading={isLoadingUpdate}
                isDisabled={isLoadingDelete}
                onPress={handleSubmit}
              >
                <Text fontWeight="bold" color="white">
                  Atualizar
                </Text>
              </Button>
            </When>
            <When is={!!id}>
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
            </When>
          </VStack>
        </BackgroundContainer>
      </StyledKeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
