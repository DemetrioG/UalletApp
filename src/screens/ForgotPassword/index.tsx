import * as React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Button, Text, VStack } from "native-base";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Toast from "react-native-toast-message";
import TextInput from "../../components/TextInput";
import {
  BackgroundContainer,
  BackgroundEffect,
  ButtonText,
  ContainerCenter,
  StyledKeyboardAvoidingView,
} from "../../styles/general";
import { resetPassword } from "./querys";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronLeft } from "lucide-react-native";
interface IForm {
  email: string;
}

const schema = yup
  .object({
    email: yup.string().required(),
  })
  .required();

const ForgotPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function sendPassword({ email }: IForm) {
    setLoading(true);
    resetPassword(email)
      .then((successMessage) => {
        navigate("Login");
        Toast.show({
          type: "success",
          text1: successMessage,
        });
      })
      .catch((errorMessage: string) => {
        Toast.show({
          type: "error",
          text1: errorMessage,
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
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
          <ContainerCenter>
            <TextInput
              placeholder="E-mail cadastrado"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              control={control}
              errors={errors}
              helperText="Informe um e-mail válido"
              isRequired
            />
          </ContainerCenter>
          <Button isLoading={loading} onPress={handleSubmit(sendPassword)}>
            <ButtonText>ENVIAR</ButtonText>
          </Button>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};

export default ForgotPassword;
