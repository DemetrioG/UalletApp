import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import Alert from "../../components/Alert";
import TextInput from "../../components/TextInput";
import { AlertContext } from "../../context/Alert/alertContext";
import { DataContext } from "../../context/Data/dataContext";
import { networkConnection } from "../../utils/network.helper";
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
            </FormContainer>
            <Button isLoading={loading} onPress={handleSubmit(sendPassword)}>
              <ButtonText>ENVIAR</ButtonText>
            </Button>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};

export default ForgotPassword;
