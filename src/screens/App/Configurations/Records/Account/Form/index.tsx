import { useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Palette } from "lucide-react-native";
import { BackgroundContainer } from "../../../../../../styles/general";
import {
  Button,
  Center,
  HStack,
  Pressable,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { IThemeProvider } from "../../../../../../styles/baseTheme";
import { FormTextInput } from "../../../../../../components/Inputs/TextInput";
import {
  useFormAccount,
  useHandleConfirmDeleteAccount,
} from "../hooks/useAccount";
import { AccountFormParams } from "../types";
import When from "../../../../../../components/When";
import { Controller } from "react-hook-form";
import { ColorPicker } from "./ColorPicker";

export const AccountForm = ({ route: { params } }: AccountFormParams) => {
  const id = params?.id;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();
  const { formMethods, isLoadingCreate, isLoadingUpdate, handleSubmit } =
    useFormAccount(id);
  const { isLoadingDelete, handleDelete } = useHandleConfirmDeleteAccount();

  const colorPicker = useDisclose();

  function handleSetColor(color: string) {
    return formMethods.setValue("color", color, { shouldDirty: true });
  }

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
            <Text fontWeight={700}>
              {!!id ? "Atualizar" : "Cadastrar"} Conta Bancária
            </Text>
          </HStack>
          <Center flex={1}>
            <VStack space={5}>
              <HStack justifyContent="space-between">
                <HStack alignItems="center" space={3}>
                  <Text>Cor de referência</Text>
                  <Controller
                    name="color"
                    control={formMethods.control}
                    render={({ field: { value } }) => (
                      <VStack
                        width="15px"
                        height="15px"
                        backgroundColor={value}
                        borderRadius={10}
                      />
                    )}
                  />
                </HStack>
                <Pressable onPress={colorPicker.onToggle}>
                  <Palette color={theme?.text} />
                </Pressable>
              </HStack>
              <FormTextInput
                variant="filled"
                placeholder="Nome da conta"
                control={formMethods.control}
                name="name"
                errors={formMethods.formState.errors.name}
                helperText={formMethods.formState.errors.name?.message}
                isRequired
              />
            </VStack>
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
              isDisabled={isLoadingUpdate || params?.name === "Carteira"}
              onPress={() => handleDelete(id)}
            >
              <Text fontWeight="bold" color={theme?.blue}>
                Excluir
              </Text>
            </Button>
          </When>
          <ColorPicker {...colorPicker} handleSetColor={handleSetColor} />
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
