import * as React from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { Button } from "native-base";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import Alert from "../../components/Alert";
import TextInput from "../../components/TextInput";
import TextInputPassword from "../../components/TextInputPassword";
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
  Logo,
  LogoHeader,
  StyledKeyboardAvoidingView,
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
    password: yup.string().required().matches(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")),
    confirm: yup.string().required(),
  })
  .required();

const Register = () => {
  const { setAlert } = React.useContext(AlertContext);
  const {
    data: { isNetworkConnected },
  } = React.useContext(DataContext);
  const [loading, setLoading] = React.useState(false);
  const [isPasswordFieldFocused, setPasswordFieldFocused] = React.useState(false);
  const passwordRef = React.useRef();

  const handleFocus = () => setPasswordFieldFocused(true);
  const handleBlur = () => setPasswordFieldFocused(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const passwordText = watch("password");

  React.useEffect(() => {
    const passwordError = errors?.password?.message;
    const isPasswordWeak = passwordError?.includes("must match");
    if(!isPasswordWeak) return;
    (passwordRef.current as any)?.focus();
  }, [errors.password]);

  async function registerUser({ name, email, password, confirm }: IForm) {
    if (networkConnection(isNetworkConnected!, setAlert)) {
      if (password !== confirm) {
        setAlert(() => ({
          visibility: true,
          type: "error",
          title: "As senhas informadas são diferentes",
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
              }));
              break;
            case "auth/invalid-email":
              setAlert(() => ({
                visibility: true,
                type: "error",
                title: "O e-mail informado é inválido",
              }));
              break;
            case "auth/email-already-in-use":
              setAlert(() => ({
                visibility: true,
                type: "error",
                title: "Usuário já cadastrado",
              }));
              break;
            default:
              setAlert(() => ({
                visibility: true,
                type: "error",
                title: "Erro ao cadastrar usuário",
              }));
              break;
          }
        });
      return setLoading(false);
    }
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <Alert />
          <LogoHeader>
            <Logo source={require("../../../assets/images/logo.png")} />
            <TextHeader withMarginLeft fontSize={"3xl"}>
              Uallet
            </TextHeader>
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
                ref={passwordRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <TextInputPassword
                placeholder="Confirme sua senha *"
                onSubmitEditing={handleSubmit(registerUser)}
                returnKeyType="done"
                name="confirm"
                control={control}
                errors={errors.confirm}
                helperText="Informe todos os campos"
              />
            </FormContainer>
            {isPasswordFieldFocused && <PasswordRules mb={5} content={passwordText}/>}
            <Button isLoading={loading} onPress={handleSubmit(registerUser)}>
              <ButtonText>CRIAR CONTA</ButtonText>
            </Button>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};

export default Register;
