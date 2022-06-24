import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firebase from "../../services/firebase";

import { AlertContext } from "../../context/Alert/alertContext";
import { DataContext } from "../../context/Data/dataContext";
import Alert from "../../components/Alert";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HeaderTitle,
  HeaderTitleContainer,
  LogoHeader,
  StyledButton,
  StyledKeyboardAvoidingView,
  StyledLoading,
  StyledTextInput,
  TextHeader,
} from "../../styles/general";
import { networkConnection } from "../../utils/network.helper";
interface IForm {
  email: string;
}

const schema = yup
  .object({
    email: yup.string().required(),
  })
  .required();

export default function ForgotPassword() {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const {
    data: { isNetworkConnected },
  } = React.useContext(DataContext);
  const { setAlert } = React.useContext(AlertContext);
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  async function sendPassword({ email }: IForm) {
    if (networkConnection(isNetworkConnected!, setAlert)) {
      setLoading(true);
      await firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then((v) => {
          navigate("Login");
          setAlert(() => ({
            visibility: true,
            type: "success",
            title:
              "E-mail de redefinição enviado!\nVerifique sua caixa de SPAM",
          }));
        })
        .catch(() => {
          setAlert(() => ({
            visibility: true,
            type: "error",
            title: "E-mail não encontrado",
          }));
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <Alert />
          <LogoHeader>
            <TextHeader>Recuperar senha</TextHeader>
          </LogoHeader>
          <HeaderTitleContainer>
            <HeaderTitle>
              Digite o e-mail cadastrado na sua conta.{"\n"}Enviaremos um e-mail
              para recuperação{"\n"}da senha.
            </HeaderTitle>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
              <StyledTextInput
                placeholder="E-mail *"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                control={control}
                errors={errors}
              />
            </FormContainer>
            <StyledButton onPress={handleSubmit(sendPassword)}>
              {loading ? <StyledLoading /> : <ButtonText>ENVIAR</ButtonText>}
            </StyledButton>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
}
