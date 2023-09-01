import * as React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Actionsheet, Button, Center, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFormContext } from "react-hook-form";
import { ChevronLeft } from "lucide-react-native";

import { FormTextInput } from "../../../../components/Inputs/TextInput";
import { FormTextInputPassword } from "../../../../components/Inputs/TextInputPassword";
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
  BackgroundEffect,
} from "../../../../styles/general";
import { colors } from "../../../../styles";
import { loginByEmailAndPassword } from "../querys";
import { LoginDTO } from "../types";
import { handleToast } from "../../../../utils/functions.helper";

export const LoginForm = ({ email }: { email?: string }) => {
  const formMethods = useFormContext<LoginDTO>();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { setUser } = React.useContext(UserContext);
  const { data: dataContext } = React.useContext(DataContext);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const { isLoading, handleExecute } = usePromise(loginUser);

  React.useEffect(() => {
    if (email) formMethods.setValue("email", email);
  }, [email]);

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
        handleToast({
          type: "error",
          text1: "Verifique os campos informados",
        });
      });
  }

  return (
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer p="20px">
          <BackgroundEffect />
          <VStack space={5}>
            <TouchableOpacity onPress={() => navigate("Index")}>
              <ChevronLeft color="white" />
            </TouchableOpacity>
            <Text fontSize="36" fontWeight="700" color="white">
              Realize{"\n"}seu login!
            </Text>
          </VStack>
          <Center flex={1}>
            <FormTextInput
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              control={formMethods.control}
              errors={formMethods.formState.errors.email}
              isRequired
            />
            <FormTextInputPassword
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
          </Center>
          <VStack alignItems="center" width="100%" mb={8} space={2}>
            <Button
              isLoading={isLoading}
              onPress={formMethods.handleSubmit(handleExecute)}
            >
              <Text fontWeight="bold" color="white">
                Entrar
              </Text>
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
            <SocialContainer backgroundColor={colors.white} onPress={() => {}}>
              <GoogleLogo source={ICONS.google} />
            </SocialContainer>
            <SocialContainer
              backgroundColor={colors.facebookBlue}
              onPress={() => {}}
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
