import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useFormContext } from "react-hook-form";

import { FormTextInputPassword } from "../../../../../../components/Inputs/TextInputPassword";
import {
  BackgroundContainer,
  ButtonText,
} from "../../../../../../styles/general";
import { IThemeProvider } from "../../../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { useHandleConfirmDeleteAccount } from "../hooks/useDeleteAccount";
import { DeleteAccountDTO } from "../types";

export const DeleteAccountForm = () => {
  const { goBack } = useNavigation();
  const { theme }: IThemeProvider = useTheme();
  const formMethods = useFormContext<DeleteAccountDTO>();
  const { isLoading, handleDelete } = useHandleConfirmDeleteAccount();

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
            <Text fontWeight={700}>Excluir Conta</Text>
          </HStack>
          <VStack paddingX={2}>
            <Text fontSize={"md"}>
              Por questões de segurança, informe sua senha abaixo
            </Text>
          </VStack>
          <Center flex={1}>
            <FormTextInputPassword
              variant="filled"
              name="password"
              placeholder="Senha"
              returnKeyType="done"
              control={formMethods.control}
              errors={formMethods.formState.errors.password}
              helperText="Informe sua senha"
            />
          </Center>
          <Button
            variant="outline"
            onPress={formMethods.handleSubmit(handleDelete)}
            isLoading={isLoading}
          >
            <Text fontWeight="bold" color={theme?.blue}>
              Excluir conta
            </Text>
          </Button>
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
