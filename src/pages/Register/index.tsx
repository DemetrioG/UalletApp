import React, { useContext, useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firebase from "../../services/firebase";

import { AlertContext } from "../../context/Alert/alertContext";
import Alert from "../../components/Alert";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HeaderTitle,
  HeaderTitleContainer,
  Logo,
  LogoHeader,
  StyledButton,
  StyledKeyboardAvoidingView,
  StyledLoading,
  StyledTextInput,
  TextUalletHeader,
} from "../../styles/general";
import { colors } from "../../styles";

interface IForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    confirm: yup.string().required(),
  })
  .required();

export default function Register() {
  const { alert, setAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  async function registerUser({ name, email, password, confirm }: IForm) {
    if (password !== confirm) {
      setAlert(() => ({
        visibility: true,
        type: "error",
        title: "As senhas informadas são diferentes",
        redirect: null,
      }));
      return;
    }

    setLoading(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((v) => {
        firebase.firestore().collection("users").doc(v.user?.uid).set({
          name: name,
          email: email,
          typeUser: "default",
          dateRegister: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setAlert(() => ({
          visibility: true,
          type: "success",
          title: "Usuário criado com sucesso",
          redirect: "Login",
        }));
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/weak-password":
            setAlert(() => ({
              visibility: true,
              type: "error",
              title: "Sua senha deve ter no mínimo 6 caracteres",
              redirect: null,
            }));
            break;
          case "auth/invalid-email":
            setAlert(() => ({
              visibility: true,
              type: "error",
              title: "O e-mail informado é inválido",
              redirect: null,
            }));
            break;
          case "auth/email-already-in-use":
            setAlert(() => ({
              visibility: true,
              type: "error",
              title: "Usuário já cadastrado",
              redirect: null,
            }));
            break;
          default:
            setAlert(() => ({
              visibility: true,
              type: "error",
              title: "Erro ao cadastrar usuário",
              redirect: null,
            }));
            break;
        }
        setLoading(false);
        return;
      });
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          {alert.visibility && <Alert />}
          <LogoHeader>
            <Logo source={require("../../../assets/images/logo.png")} />
            <TextUalletHeader>Uallet</TextUalletHeader>
          </LogoHeader>
          <HeaderTitleContainer>
            <HeaderTitle>
              Informe seus dados, que o resto{"\n"}a gente cuida para você!
            </HeaderTitle>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
              <StyledTextInput
                placeholder="Nome completo"
                maxLength={40}
                name="name"
                control={control}
              />
              <StyledTextInput
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                control={control}
              />
              <StyledTextInput
                placeholder="Senha"
                secureTextEntry={true}
                maxLength={20}
                name="password"
                control={control}
              />
              <StyledTextInput
                placeholder="Confirme sua senha"
                secureTextEntry={true}
                onSubmitEditing={handleSubmit(registerUser)}
                returnKeyType="done"
                maxLength={20}
                name="confirm"
                control={control}
                helperText={errors}
              />
            </FormContainer>
            <StyledButton onPress={handleSubmit(registerUser)}>
              {loading ? (
                <StyledLoading />
              ) : (
                <ButtonText>CRIAR CONTA</ButtonText>
              )}
            </StyledButton>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
}
