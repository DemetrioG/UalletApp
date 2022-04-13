import React, { useRef, useState } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import * as AuthSession from "expo-auth-session";
import * as Facebook from "expo-facebook";

import firebase from "../../services/firebase";
import {
  ActionText,
  AppleLogo,
  FacebookLogo,
  GoogleLogo,
  SheetContainer,
  SheetView,
  SocialContainer,
} from "./styles";
import { colors, metrics } from "../../styles";
import { editVisibilityAlert } from "../../components/Actions/visibilityAlertAction";
import { editTitleAlert } from "../../components/Actions/titleAlertAction";
import { editTypeAlert } from "../../components/Actions/typeAlertAction";
import { editUidUser } from "../../components/Actions/uidUserAction";
import { editLogin } from "../../components/Actions/loginAction";
import { Alert } from "../../components/Alert";
import {
  BackgroundContainer,
  Logo,
  LogoHeader,
  StyledKeyboardAvoidingView,
  TextUalletHeader,
  HeaderTitleContainer,
  HeaderTitle,
  ContainerCenter,
  StyledTextInput,
  FormContainer,
  StyledButton,
  ButtonText,
} from "../../styles/generalStyled";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setStorage } from "../../functions/storageData";
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

export function Login(props) {
  const { navigate } = useNavigation();
  const sheetRef = useRef(null);
  const snapPoints = ["25%"];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loginUser({ email, password }: IForm) {
    setLoading(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((v) => {
        let data = {
          uid: v.user?.uid,
          // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        };
        props.editUidUser(v.user?.uid);
        setStorage("authUser", data);
        props.editLogin(true);
      })
      .catch((error) => {
        props.editTypeAlert("error");
        props.editTitleAlert("Verifique os campos informados");
        props.editVisibilityAlert(true);
      })
      .finally(() => setLoading(false));
  }

  async function googleLogin() {
    const CLIENT_ID =
      "1027938913805-2uq44iec7nrr8p5c9qqu32nbapu5gfg6.apps.googleusercontent.com";
    const REDIRECT_URI = "https://auth.expo.io/@demetriog/Uallet";
    const RESPONSE_TYPE = "token";
    const SCOPE = encodeURI("profile email");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    // Autenticação com o Google
    const response = await AuthSession.startAsync({ authUrl });

    if (response.type === "success") {
      // Buscar informações do usuário
      const user = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${response.params.access_token}`
      );
      const userInfo = await user.json();

      // Cadastrar usuário no banco
      await firebase
        .firestore()
        .collection("users")
        .doc(userInfo.id)
        .get()
        .then((v) => {
          if (!v.data()) {
            firebase.firestore().collection("users").doc(userInfo.id).set({
              name: userInfo.name,
              email: userInfo.email,
              typeUser: "google",
              dateRegister: firebase.firestore.FieldValue.serverTimestamp(),
            });
          }
        });

      let data = {
        uid: userInfo.id,
        // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      };
      setStorage("authUser", data);
      props.editUidUser(userInfo.id);
      props.editLogin(true);
    }
    return;
  }

  async function facebookLogin() {
    // Autenticação com o Facebook
    await Facebook.initializeAsync("623678532217571");

    const response = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"],
    });

    // Buscar informações do usuário
    if (response.type === "success") {
      const data = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture.type(large),email&access_token=${response.token}`
      );

      const userInfo = await data.json();

      // Cadastrar usuário no banco
      await firebase
        .firestore()
        .collection("users")
        .doc(userInfo.id)
        .get()
        .then((v) => {
          if (!v.data()) {
            firebase.firestore().collection("users").doc(userInfo.id).set({
              name: userInfo.name,
              email: userInfo.email,
              typeUser: "facebook",
              dateRegister: firebase.firestore.FieldValue.serverTimestamp(),
            });
          }
        });

      let dataStorage = {
        uid: userInfo.id,
        // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      };
      setStorage("authUser", dataStorage);
      props.editUidUser(userInfo.id);
      props.editLogin(true);
    }
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          {props.visibility && (
            <Alert props={props} text={props.title} type={props.type} />
          )}
          <LogoHeader>
            <Logo source={LOGO} />
            <TextUalletHeader>Uallet</TextUalletHeader>
          </LogoHeader>
          <HeaderTitleContainer>
            <HeaderTitle>
              É um prazer ter você aqui novamente.{"\n"}Realize seu login
              abaixo!
            </HeaderTitle>
          </HeaderTitleContainer>
          <ContainerCenter>
            <FormContainer>
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
                onSubmitEditing={handleSubmit(loginUser)}
                returnKeyType="done"
                maxLength={20}
                name="password"
                control={control}
                helperText={errors}
              />
            </FormContainer>
            <StyledButton
              additionalMargin={metrics.doubleBaseMargin}
              onPress={handleSubmit(loginUser)}
            >
              {loading ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <ButtonText>ENTRAR</ButtonText>
              )}
            </StyledButton>
            <TouchableOpacity onPress={() => setSheetOpen(true)}>
              <ActionText>Prefere entrar com as redes sociais?</ActionText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate("Forgot")}>
              <ActionText>Esqueceu sua senha?</ActionText>
            </TouchableOpacity>
          </ContainerCenter>
        </BackgroundContainer>
      </TouchableWithoutFeedback>

      {sheetOpen && (
        <SheetContainer
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setSheetOpen(false)}
        >
          <BottomSheetView>
            <SheetView>
              {Platform.OS === "ios" && (
                <SocialContainer backgroundColor={colors.black}>
                  <AppleLogo source={ICONS.apple} />
                </SocialContainer>
              )}
              <SocialContainer
                backgroundColor={colors.white}
                onPress={googleLogin}
              >
                <GoogleLogo source={ICONS.google} />
              </SocialContainer>
              <SocialContainer
                backgroundColor={colors.facebookBlue}
                onPress={facebookLogin}
              >
                <FacebookLogo source={ICONS.facebook} />
              </SocialContainer>
            </SheetView>
          </BottomSheetView>
        </SheetContainer>
      )}
    </StyledKeyboardAvoidingView>
  );
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    visibility: state.modal.visibility,
    title: state.modal.title,
    type: state.modal.type,
    uid: state.user.uid,
    login: state.login.signed,
  };
};

const loginConnect = connect(mapStateToProps, {
  editVisibilityAlert,
  editTitleAlert,
  editTypeAlert,
  editUidUser,
  editLogin,
})(Login);

export default loginConnect;
