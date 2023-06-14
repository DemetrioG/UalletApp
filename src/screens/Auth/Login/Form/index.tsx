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
import { useFormContext } from "react-hook-form";
import { ChevronLeft } from "lucide-react-native";

import TextInput from "../../../../components/TextInput";
import TextInputPassword from "../../../../components/TextInputPassword";
import When from "../../../../components/When";
import { DataContext } from "../../../../context/Data/dataContext";
import { UserContext } from "../../../../context/User/userContext";
import { usePromise } from "../../../../hooks/usePromise";
import { setStorage } from "../../../../utils/storage.helper";
import {
  AppleLogo,
  FacebookLogo,
  GoogleLogo,
  SheetView,
  SocialContainer,
} from "../styles";
import {
  BackgroundContainer,
  StyledKeyboardAvoidingView,
  ContainerCenter,
  ButtonText,
  BackgroundEffect,
} from "../../../../styles/general";
import { colors } from "../../../../styles";
import {
  loginByEmailAndPassword,
  loginByFacebook,
  loginByGoogle,
} from "../querys";
import { LoginDTO } from "../types";

export const LoginForm = () => {
  const formMethods = useFormContext<LoginDTO>();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { setUser } = React.useContext(UserContext);
  const { data: dataContext } = React.useContext(DataContext);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const { isLoading, handleExecute } = usePromise(loginUser);

  async function loginUser(formData: LoginDTO) {
    const data = {
      ...formData,
      expoPushToken: dataContext.expoPushToken!,
    };
    return loginByEmailAndPassword(data)
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
      });
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <BackgroundEffect />
          <VStack space={5}>
            <TouchableOpacity onPress={() => navigate("Index")}>
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
              control={formMethods.control}
              errors={formMethods.formState.errors.email}
              isRequired
            />
            <TextInputPassword
              placeholder="Senha"
              onSubmitEditing={formMethods.handleSubmit(handleExecute)}
              returnKeyType="done"
              name="password"
              control={formMethods.control}
              errors={formMethods.formState.errors}
              helperText="Informe todos os campos"
              isRequired
            />
            <VStack width="100%" alignItems="flex-end">
              <TouchableOpacity onPress={() => navigate("Forgot")}>
                <Text>Esqueceu sua senha</Text>
              </TouchableOpacity>
            </VStack>
          </ContainerCenter>
          <VStack alignItems="center" width="100%" mb={8} space={2}>
            <Button
              isLoading={isLoading}
              onPress={formMethods.handleSubmit(handleExecute)}
            >
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
              onPress={() => loginByGoogle()}
            >
              <GoogleLogo source={ICONS.google} />
            </SocialContainer>
            <SocialContainer
              backgroundColor={colors.facebookBlue}
              onPress={() => loginByFacebook()}
            >
              <FacebookLogo source={ICONS.facebook} />
            </SocialContainer>
          </SheetView>
        </Actionsheet.Content>
      </Actionsheet>
    </StyledKeyboardAvoidingView>
  );
};

const ICONS = {
  apple: require("../../../../../assets/images/appleIcon.png"),
  google: require("../../../../../assets/images/googleIcon.png"),
  facebook: require("../../../../../assets/images/facebookIcon.png"),
};
