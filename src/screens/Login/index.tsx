import * as React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import * as AuthSession from "expo-auth-session";
import * as Facebook from "expo-facebook";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import firebase from "../../services/firebase";
import Alert from "../../components/Alert";
import { UserContext } from "../../context/User/userContext";
import { DataContext } from "../../context/Data/dataContext";
import { AlertContext } from "../../context/Alert/alertContext";
import { setStorage } from "../../utils/storage.helper";
import { networkConnection } from "../../utils/network.helper";
import {
  ActionText,
  AppleLogo,
  FacebookLogo,
  GoogleLogo,
  SheetContainer,
  SheetView,
  SocialContainer,
} from "./styles";
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
  StyledLoading,
  StyledIcon,
  PasswordContainer,
  PasswordLook,
} from "../../styles/general";
import { colors, metrics } from "../../styles";
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

export default function Login() {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const {
    data: { isNetworkConnected },
  } = React.useContext(DataContext);
  const { setUser } = React.useContext(UserContext);
  const { setAlert } = React.useContext(AlertContext);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [lookPassword, setLookPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const sheetRef = React.useRef(null);
  const snapPoints = ["25%"];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  async function loginUser({ email, password }: IForm) {
    if (networkConnection(isNetworkConnected!, setAlert)) {
      setLoading(true);
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((v) => {
          const data = {
            uid: v.user?.uid,
            // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
            date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          };
          setStorage("authUser", data);
          setUser((userState) => ({
            ...userState,
            uid: v.user?.uid || "",
            signed: true,
          }));
        })
        .catch(() => {
          setAlert(() => ({
            visibility: true,
            type: "error",
            title: "Verifique os campos informados",
          }));
        })
        .finally(() => setLoading(false));
    }
  }

  async function googleLogin() {
    if (networkConnection(isNetworkConnected!, setAlert)) {
      setLoading(true);
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

        const data = {
          uid: userInfo.id,
          // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        };
        setStorage("authUser", data);
        setUser((userState) => ({
          ...userState,
          uid: userInfo.id,
          signed: true,
        }));
      }
      return setLoading(false);
    }
  }

  async function facebookLogin() {
    if (networkConnection(isNetworkConnected!, setAlert)) {
      setLoading(true);
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

        const dataStorage = {
          uid: userInfo.id,
          // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        };
        setStorage("authUser", dataStorage);
        setUser((userState) => ({
          ...userState,
          uid: userInfo.id,
          signed: true,
        }));
        return setLoading(false);
      }
    }
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <Alert />
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
                placeholder="E-mail *"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                control={control}
              />
              <PasswordContainer>
                <StyledTextInput
                  placeholder="Senha *"
                  secureTextEntry={!lookPassword}
                  onSubmitEditing={handleSubmit(loginUser)}
                  returnKeyType="done"
                  maxLength={20}
                  name="password"
                  control={control}
                  errors={errors}
                />
                <PasswordLook onPress={() => setLookPassword(!lookPassword)}>
                  <StyledIcon
                    name={!lookPassword ? "eye" : "eye-off"}
                    size={17}
                    color={colors.gray}
                  />
                </PasswordLook>
              </PasswordContainer>
            </FormContainer>
            <StyledButton
              additionalMargin={metrics.doubleBaseMargin}
              onPress={handleSubmit(loginUser)}
            >
              {loading ? <StyledLoading /> : <ButtonText>ENTRAR</ButtonText>}
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
