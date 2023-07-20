import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { useFormContext, useWatch } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { FormTextInputPassword } from "../../../../../../components/Inputs/TextInputPassword";
import { BackgroundContainer } from "../../../../../../styles/general";
import { PasswordRules } from "../../../../../Auth/Register/PasswordRules";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../../../styles/baseTheme";
import { ChevronLeft } from "lucide-react-native";
import { useChangePassword } from "../hooks/useAlterarSenha";
import { AlterarSenhaDTO } from "../types";

export const AlterarSenhaForm = () => {
  const formMethods = useFormContext<AlterarSenhaDTO>();
  const { goBack } = useNavigation<NativeStackNavigationProp<any>>();
  const { isLoading, handleExecute } = useChangePassword(formMethods);
  const { theme }: IThemeProvider = useTheme();
  const newPassword = useWatch({
    control: formMethods.control,
    name: "newPassword",
  });

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
            <Text fontWeight={700}>Alterar Senha</Text>
          </HStack>
          <Center flex={1}>
            <FormTextInputPassword
              variant="filled"
              placeholder="Senha atual"
              name="oldPassword"
              returnKeyType="done"
              control={formMethods.control}
              errors={formMethods.formState.errors.oldPassword}
            />
            <FormTextInputPassword
              variant="filled"
              placeholder="Nova senha"
              returnKeyType="done"
              name="newPassword"
              control={formMethods.control}
              errors={formMethods.formState.errors.newPassword}
              helperText="Informe todos os campos"
            />
            <VStack w="100%">
              <PasswordRules content={newPassword} primary />
            </VStack>
          </Center>
          <Button
            isLoading={isLoading}
            onPress={formMethods.handleSubmit(handleExecute)}
          >
            <Text fontWeight="bold" color="white">
              Alterar senha
            </Text>
          </Button>
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
