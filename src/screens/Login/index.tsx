import * as React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Actionsheet, Button, Text, VStack } from "native-base";
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
  AppleLogo,
  BackgroundEffect,
  FacebookLogo,
  GoogleLogo,
  SheetView,
  SocialContainer,
} from "./styles";
import {
  BackgroundContainer,
  StyledKeyboardAvoidingView,
  ContainerCenter,
  ButtonText,
} from "../../styles/general";
import { colors } from "../../styles";
import TextInputPassword from "../../components/TextInputPassword";
import {
  loginByEmailAndPassword,
  loginByFacebook,
  loginByGoogle,
} from "./querys";
import { DataContext } from "../../context/Data/dataContext";

import { ChevronLeft } from "lucide-react-native";
import When from "../../components/When";
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
          <BackgroundEffect />
          <VStack space={5}>
            <TouchableOpacity>
              <ChevronLeft color="white" />
            </TouchableOpacity>
            <Text fontSize="36" fontWeight="700" color="white">
              Realize{"\n"}seu login!
            </Text>
          </VStack>
          <ContainerCenter>
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
            <VStack width="100%" alignItems="flex-end">
              <TouchableOpacity onPress={() => navigate("Forgot")}>
                <Text>Esqueceu sua senha</Text>
              </TouchableOpacity>
            </VStack>
          </ContainerCenter>
          <VStack alignItems="center" width="100%" mb={8} space={2}>
            <Button isLoading={loading} onPress={handleSubmit(loginUser)}>
              <ButtonText>Entrar</ButtonText>
            </Button>
            <TouchableOpacity onPress={() => setSheetOpen(true)}>
              <Text>Prefere entrar com as redes sociais?</Text>
            </TouchableOpacity>
          </VStack>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
      <Actionsheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Actionsheet.Content backgroundColor={colors.transpDark}>
          <SheetView>
            <When is={Platform.OS === "ios"}>
              <SocialContainer backgroundColor={colors.black}>
                <AppleLogo source={ICONS.apple} />
              </SocialContainer>
            </When>
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
