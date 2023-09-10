import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { BackgroundContainer } from "../../../../../../styles/general";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { IThemeProvider } from "../../../../../../styles/baseTheme";
import { FormTextInput } from "../../../../../../components/Inputs/TextInput";
import { useDeleteAccount, useFormAccount } from "../hooks/useAccount";
import { AccountFormParams } from "../types";
import { useEffect } from "react";
import When from "../../../../../../components/When";

export const AccountForm = ({ route: { params } }: AccountFormParams) => {
  const id = params?.id;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { formMethods, isLoadingCreate, isLoadingUpdate, handleSubmit } =
    useFormAccount(id);
  const { isLoadingDelete, handleDelete } = useDeleteAccount();

  useEffect(() => {
    params && formMethods.reset(params);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text fontWeight={700}>Cadastrar Conta Bancária</Text>
          </HStack>
          <Center flex={1}>
            <FormTextInput
              variant="filled"
              placeholder="Nome da conta"
              control={formMethods.control}
              name="name"
              errors={formMethods.formState.errors.name}
              helperText={formMethods.formState.errors.name?.message}
              isRequired
            />
            <FormTextInput
              variant="filled"
              name="balance"
              placeholder="Saldo inicial"
              control={formMethods.control}
              errors={formMethods.formState.errors.balance}
              masked="money"
              helperText="Informe saldo inicial da conta"
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
              onPress={() => handleDelete(id)}
            >
              <Text fontWeight="bold" color={theme?.blue}>
                Excluir
              </Text>
            </Button>
          </When>
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
