import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
import { registerUser } from "./query";

export interface IRegister {
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

const LOGO = require("../../../assets/images/logo.png");

const Register = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRegister>({
    resolver: yupResolver(schema),
  });

  const passwordText = watch("password");

  function submit(props: IRegister) {
    setLoading(true);
    registerUser(props)
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
      })
      .finally(() => setLoading(false));
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundContainer>
        <LogoHeader>
          <Logo source={LOGO} />
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
              placeholder="Nome completo"
              maxLength={40}
              name="name"
              control={control}
              errors={errors.name}
            />
            <TextInput
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              control={control}
              errors={errors.email}
            />
            <TextInputPassword
              placeholder="Senha"
              name="password"
              control={control}
              errors={errors.password}
            />
            <TextInputPassword
              placeholder="Confirme sua senha"
              onSubmitEditing={handleSubmit(submit)}
              returnKeyType="done"
              name="confirm"
              control={control}
              errors={errors.password}
              helperText="Informe todos os campos"
            />
            <PasswordRules mb={5} content={passwordText} />
            <Button isLoading={loading} onPress={handleSubmit(submit)}>
              <ButtonText>CRIAR CONTA</ButtonText>
            </Button>
          </FormContainer>
        </ContainerCenter>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};

export default Register;
