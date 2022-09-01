import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, HStack } from "native-base";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as yup from "yup";

import Icon from "../../../../components/Icon";
import TextInputPassword from "../../../../components/TextInputPassword";
import {
  BackgroundContainer,
  ButtonText,
  ContainerCenter,
  FormContainer,
  StyledKeyboardAvoidingView,
  TextHeaderScreen,
  ViewTab,
} from "../../../../styles/general";
import PasswordRules from "../../../Register/PasswordRules";
import { changePassword } from "./querys";

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

export const AlterarSenhaScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const { goBack, navigate } = useNavigation<NativeStackNavigationProp<any>>();
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
    <StyledKeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundContainer>
          <ViewTab>
            <HStack alignItems="center" space={3} mb={10}>
              <Icon name="chevron-left" size={24} onPress={goBack} />
              <TextHeaderScreen noMarginBottom>Alterar Senha</TextHeaderScreen>
            </HStack>
            <ContainerCenter>
              <FormContainer insideApp>
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
                <Button
                  mt={5}
                  isLoading={loading}
                  onPress={handleSubmit(onSubmit)}
                >
                  <ButtonText>ALTERAR SENHA</ButtonText>
                </Button>
              </FormContainer>
            </ContainerCenter>
          </ViewTab>
        </BackgroundContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};
