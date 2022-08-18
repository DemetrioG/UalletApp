import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import TextInput from "../../components/TextInput";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HeaderTitle,
  HeaderTitleContainer,
  LogoHeader,
  StyledKeyboardAvoidingView,
  TextHeader,
} from "../../styles/general";
interface IForm {
  email: string;
}

const schema = yup
  .object({
    email: yup.string().required(),
  })
  .required();

const ForgotPassword = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  async function sendPassword({ email }: IForm) {
    setLoading(true);
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then((v) => {
        navigate("Login");
        Toast.show({
          type: "success",
          text1: "E-mail de redefinição enviado!\nVerifique sua caixa de SPAM",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "E-mail não encontrado",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <LogoHeader>
            <TextHeader withMarginTop fontSize={"2xl"}>
              Recuperar senha
            </TextHeader>
          </LogoHeader>
          <HeaderTitleContainer>
            <HeaderTitle>
              Digite o e-mail cadastrado na sua conta.{"\n"}Enviaremos um e-mail
              para recuperação da senha.
            </HeaderTitle>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
              <TextInput
                placeholder="E-mail *"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                control={control}
                errors={errors}
                helperText="Informe um e-mail válido"
              />
              <Button isLoading={loading} onPress={handleSubmit(sendPassword)}>
                <ButtonText>ENVIAR</ButtonText>
              </Button>
            </FormContainer>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};

export default ForgotPassword;
