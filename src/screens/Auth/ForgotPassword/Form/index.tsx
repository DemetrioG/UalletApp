import * as React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Button, Center, Text, VStack } from "native-base";

import { FormTextInput } from "../../../../components/Inputs/TextInput";
import {
  BackgroundContainer,
  BackgroundEffect,
  StyledKeyboardAvoidingView,
} from "../../../../styles/general";
import { resetPassword } from "../querys";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronLeft } from "lucide-react-native";
import { usePromise } from "../../../../hooks/usePromise";
import { ForgotPasswordDTO } from "../types";
import { useFormContext } from "react-hook-form";
import { handleToast } from "../../../../utils/functions.helper";

export const ForgotPasswordForm = () => {
  const { isLoading, handleExecute } = usePromise(sendPassword);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const formMethods = useFormContext();

  async function sendPassword({ email }: ForgotPasswordDTO) {
    return resetPassword(email)
      .then((successMessage) => {
        navigate("Login");
        handleToast({
          type: "success",
          text1: successMessage,
        });
      })
      .catch((errorMessage: string) => {
        handleToast({
          type: "error",
          text1: errorMessage,
        });
      });
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer p="20px">
          <BackgroundEffect />
          <VStack space={5}>
            <TouchableOpacity onPress={() => navigate("Login")}>
              <ChevronLeft color="white" />
            </TouchableOpacity>
            <Text fontSize="36" fontWeight="700" color="white">
              Recuperar{"\n"}senha
            </Text>
            <Text color="white">Verifique sua caixa de spam!</Text>
          </VStack>
          <Center flex={1}>
            <FormTextInput
              placeholder="E-mail cadastrado"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              control={formMethods.control}
              errors={formMethods.formState.errors}
              helperText="Informe um e-mail válido"
              isRequired
            />
          </Center>
          <Button
            isLoading={isLoading}
            onPress={formMethods.handleSubmit(handleExecute)}
          >
            <Text fontWeight="bold" color="white">
              Enviar
            </Text>
          </Button>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};
