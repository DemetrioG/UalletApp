import * as React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Actionsheet, Button } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextInput from "../../components/TextInput";
import { UserContext } from "../../context/User/userContext";
import { setStorage } from "../../utils/storage.helper";
import {
  ActionText,
  AppleLogo,
  FacebookLogo,
  GoogleLogo,
  SheetView,
  SocialContainer,
} from "./styles";
import {
  BackgroundContainer,
  Logo,
  LogoHeader,
  StyledKeyboardAvoidingView,
  HeaderTitleContainer,
  HeaderTitle,
  ContainerCenter,
  FormContainer,
  ButtonText,
  TextHeader,
} from "../../styles/general";
import { colors } from "../../styles";
import TextInputPassword from "../../components/TextInputPassword";
import {
  loginByEmailAndPassword,
  loginByFacebook,
  loginByGoogle,
} from "./querys";
import { DataContext } from "../../context/Data/dataContext";
interface IForm {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const LOGO = require("../../../assets/images/logo.png");
const ICONS = {
  apple: require("../../../assets/images/appleIcon.png"),
  google: require("../../../assets/images/googleIcon.png"),
  facebook: require("../../../assets/images/facebookIcon.png"),
};

const Login = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { setUser } = React.useContext(UserContext);
  const { data: dataContext } = React.useContext(DataContext);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  async function loginUser(props: IForm) {
    const data = {
      ...props,
      expoPushToken: dataContext.expoPushToken!,
    };
    setLoading(true);
    loginByEmailAndPassword(data)
      .then((loggedSucceedData) => {
        setStorage("authUser", loggedSucceedData);
        setUser((userState) => ({
          ...userState,
          uid: loggedSucceedData.uid || "",
          signed: true,
        }));
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Verifique os campos informados",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <LogoHeader>
            <Logo source={LOGO} />
            <TextHeader withMarginLeft>Uallet</TextHeader>
          </LogoHeader>
          <HeaderTitleContainer>
            <HeaderTitle>
              É um prazer ter você aqui novamente.{"\n"}Realize seu login
              abaixo!
            </HeaderTitle>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
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
                onSubmitEditing={handleSubmit(loginUser)}
                returnKeyType="done"
                name="password"
                control={control}
                errors={errors}
                helperText="Informe todos os campos"
              />
              <Button isLoading={loading} onPress={handleSubmit(loginUser)}>
                <ButtonText>ENTRAR</ButtonText>
              </Button>
            </FormContainer>
            <TouchableOpacity onPress={() => setSheetOpen(true)}>
              <ActionText>Prefere entrar com as redes sociais?</ActionText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate("Forgot")}>
              <ActionText>Esqueceu sua senha?</ActionText>
            </TouchableOpacity>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
      <Actionsheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Actionsheet.Content backgroundColor={colors.transpDark}>
          <SheetView>
            {Platform.OS === "ios" && (
              <SocialContainer backgroundColor={colors.black}>
                <AppleLogo source={ICONS.apple} />
              </SocialContainer>
            )}
            <SocialContainer
              backgroundColor={colors.white}
              onPress={loginByGoogle}
            >
              <GoogleLogo source={ICONS.google} />
            </SocialContainer>
            <SocialContainer
              backgroundColor={colors.facebookBlue}
              onPress={loginByFacebook}
            >
              <FacebookLogo source={ICONS.facebook} />
            </SocialContainer>
          </SheetView>
        </Actionsheet.Content>
      </Actionsheet>
    </StyledKeyboardAvoidingView>
  );
};

export default Login;
