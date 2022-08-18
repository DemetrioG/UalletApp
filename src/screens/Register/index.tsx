import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import TextInput from "../../components/TextInput";
import TextInputPassword from "../../components/TextInputPassword";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  HeaderTitle,
  HeaderTitleContainer,
  Logo,
  LogoHeader,
  TextHeader,
} from "../../styles/general";
import PasswordRules from "./PasswordRules";

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
    password: yup
      .string()
      .required()
      .matches(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      ),
    confirm: yup.string().required(),
  })
  .required();

const Register = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const passwordText = watch("password");

  async function registerUser({ name, email, password, confirm }: IForm) {
    if (password !== confirm) {
      return Toast.show({
        type: "error",
        text1: "As senhas informadas são diferentes",
      });
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
        Toast.show({
          type: "success",
          text1: "Usuário criado com sucesso",
        });
        return navigate("Login");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/weak-password":
            Toast.show({
              type: "error",
              text1: "Sua senha deve ter no mínimo 6 caracteres",
            });
            break;
          case "auth/invalid-email":
            Toast.show({
              type: "error",
              text1: "O e-mail informado é inválido",
            });
            break;
          case "auth/email-already-in-use":
            Toast.show({
              type: "error",
              text1: "Usuário já cadastrado",
            });
            break;
          default:
            Toast.show({
              type: "error",
              text1: "Erro ao cadastrar usuário",
            });
            break;
        }
      });
    return setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundContainer>
        <LogoHeader>
          <Logo source={require("../../../assets/images/logo.png")} />
          <TextHeader withMarginLeft>Uallet</TextHeader>
        </LogoHeader>
        <HeaderTitleContainer>
          <HeaderTitle>
            Informe seus dados, que o resto{"\n"}a gente cuida para você!
          </HeaderTitle>
        </HeaderTitleContainer>
        <ContainerCenter>
          <FormContainer>
            <TextInput
              placeholder="Nome completo *"
              maxLength={40}
              name="name"
              control={control}
              errors={errors.name}
            />
            <TextInput
              placeholder="E-mail *"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              control={control}
              errors={errors.email}
            />
            <TextInputPassword
              placeholder="Senha *"
              name="password"
              control={control}
              errors={errors.password}
            />
            <TextInputPassword
              placeholder="Confirme sua senha *"
              onSubmitEditing={handleSubmit(registerUser)}
              returnKeyType="done"
              name="confirm"
              control={control}
              errors={errors.password}
              helperText="Informe todos os campos"
            />
            <PasswordRules mb={5} content={passwordText} />
            <Button isLoading={loading} onPress={handleSubmit(registerUser)}>
              <ButtonText>CRIAR CONTA</ButtonText>
            </Button>
          </FormContainer>
        </ContainerCenter>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};

export default Register;
