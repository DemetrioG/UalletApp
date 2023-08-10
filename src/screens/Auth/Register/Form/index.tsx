import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, Center, Text, VStack } from "native-base";
import { useFormContext, useWatch } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { FormTextInput } from "../../../../components/Inputs/TextInput";
import { FormTextInputPassword } from "../../../../components/Inputs/TextInputPassword";
import {
  BackgroundContainer,
  BackgroundEffect,
} from "../../../../styles/general";
import { PasswordRules } from "../PasswordRules";
import { registerUser } from "../query";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { usePromise } from "../../../../hooks/usePromise";
import { RegisterDTO } from "../types";
import { handleToast } from "../../../../utils/functions.helper";

export const RegisterForm = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { isLoading, handleExecute } = usePromise(register);
  const formMethods = useFormContext<RegisterDTO>();
  const passwordText = useWatch({
    control: formMethods.control,
    name: "password",
  });

  async function register(props: RegisterDTO) {
    return registerUser(props)
      .then(() => {
        handleToast({
          type: "success",
          text1: "Usuário cadastrado com sucesso",
        });
        return navigate("Login");
      })
      .catch((error) => {
        return handleToast({
          type: "error",
          text1: error,
        });
      });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundContainer p="20px">
        <BackgroundEffect />
        <VStack space={5}>
          <TouchableOpacity onPress={() => navigate("Index")}>
            <ChevronLeft color="white" />
          </TouchableOpacity>
          <Text fontSize="36" fontWeight="700" color="white">
            Crie sua{"\n"}conta!
          </Text>
        </VStack>
        <Center flex={1}>
          <FormTextInput
            placeholder="Nome completo"
            maxLength={40}
            name="name"
            control={formMethods.control}
            errors={formMethods.formState.errors.name}
            isRequired
          />
          <FormTextInput
            placeholder="E-mail"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            name="email"
            control={formMethods.control}
            errors={formMethods.formState.errors.email}
            isRequired
          />
          <FormTextInputPassword
            placeholder="Senha"
            name="password"
            control={formMethods.control}
            errors={formMethods.formState.errors.password}
            isRequired
          />
          <FormTextInputPassword
            placeholder="Confirme sua senha"
            onSubmitEditing={formMethods.handleSubmit(handleExecute)}
            returnKeyType="done"
            name="confirm"
            control={formMethods.control}
            errors={formMethods.formState.errors.password}
            helperText="Informe todos os campos"
            isRequired
          />
          <VStack width="100%">
            <PasswordRules mb={5} content={passwordText} />
          </VStack>
        </Center>
        <Button
          isLoading={isLoading}
          onPress={formMethods.handleSubmit(handleExecute)}
        >
          <Text fontWeight="bold" color="white">
            Criar conta
          </Text>
        </Button>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};
