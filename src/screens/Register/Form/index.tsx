import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, Text, VStack } from "native-base";
import Toast from "react-native-toast-message";
import { useFormContext, useWatch } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import TextInput from "../../../components/TextInput";
import TextInputPassword from "../../../components/TextInputPassword";
import {
  BackgroundContainer,
  BackgroundEffect,
  ButtonText,
  ContainerCenter,
} from "../../../styles/general";
import PasswordRules from "../PasswordRules";
import { registerUser } from "../query";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { usePromise } from "../../../hooks/usePromise";
import { RegisterDTO } from "../types";

const RegisterForm = () => {
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
        Toast.show({
          type: "success",
          text1: "Usuário cadastrado com sucesso",
        });
        return navigate("Login");
      })
      .catch((error) => {
        return Toast.show({
          type: "error",
          text1: error,
        });
      });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundContainer>
        <BackgroundEffect />
        <VStack space={5}>
          <TouchableOpacity onPress={() => navigate("Index")}>
            <ChevronLeft color="white" />
          </TouchableOpacity>
          <Text fontSize="36" fontWeight="700" color="white">
            Crie sua{"\n"}conta!
          </Text>
        </VStack>
        <ContainerCenter>
          <TextInput
            placeholder="Nome completo"
            maxLength={40}
            name="name"
            control={formMethods.control}
            errors={formMethods.formState.errors.name}
            isRequired
          />
          <TextInput
            placeholder="E-mail"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            name="email"
            control={formMethods.control}
            errors={formMethods.formState.errors.email}
            isRequired
          />
          <TextInputPassword
            placeholder="Senha"
            name="password"
            control={formMethods.control}
            errors={formMethods.formState.errors.password}
            isRequired
          />
          <TextInputPassword
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
        </ContainerCenter>
        <Button
          isLoading={isLoading}
          onPress={formMethods.handleSubmit(handleExecute)}
        >
          <ButtonText>Criar conta</ButtonText>
        </Button>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};

export default RegisterForm;
