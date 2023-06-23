import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as yup from "yup";

import TextInputPassword from "../../../../../components/TextInputPassword";
import { BackgroundContainer, ButtonText } from "../../../../../styles/general";
import PasswordRules from "../../../../Auth/Register/PasswordRules";
import { changePassword } from "./querys";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { ChevronLeft } from "lucide-react-native";

const defaultValues = {
  oldPassword: "",
  newPassword: "",
};

const schema = yup
  .object({
    newPassword: yup
      .string()
      .required()
      .matches(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      ),
    oldPassword: yup.string().required(),
  })
  .required();

const AlterarSenhaScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { theme }: IThemeProvider = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  async function onSubmit(formValues: typeof defaultValues) {
    setLoading(true);

    const changed = await changePassword(formValues);

    if (!changed) {
      Toast.show({
        type: "error",
        text1: "A senha antiga é inválida",
      });
      setError("oldPassword", { message: "error", type: "value" });
      return setLoading(false);
    }

    Toast.show({
      type: "success",
      text1: "Senha alterada com sucesso",
    });
    return navigate("Home");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundContainer>
        <VStack
          backgroundColor={theme?.secondary}
          flex={1}
          p={5}
          borderTopLeftRadius="30px"
          borderTopRightRadius="30px"
        >
          <HStack alignItems="center" space={3} mb={10}>
            <Pressable onPress={goBack}>
              <ChevronLeft color={theme?.text} />
            </Pressable>
            <Text fontWeight={700}>Alterar Senha</Text>
          </HStack>
          <Center flex={1}>
            <TextInputPassword
              placeholder="Senha atual"
              name="oldPassword"
              returnKeyType="done"
              control={control}
              errors={errors.oldPassword}
            />
            <TextInputPassword
              placeholder="Nova senha"
              returnKeyType="done"
              name="newPassword"
              control={control}
              errors={errors.newPassword}
              helperText="Informe todos os campos"
            />
            <PasswordRules content={watch("newPassword")} />
            <Button mt={5} isLoading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>ALTERAR SENHA</ButtonText>
            </Button>
          </Center>
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};

export default AlterarSenhaScreen;
