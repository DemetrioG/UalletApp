import * as React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Toast from "react-native-toast-message";

import Icon from "../../../../../components/Icon";
import TextInputPassword from "../../../../../components/TextInputPassword";
import { ConfirmContext } from "../../../../../context/ConfirmDialog/confirmContext";
import {
  initialUserState,
  UserContext,
} from "../../../../../context/User/userContext";
import {
  BackgroundContainer,
  ButtonDelete,
  ButtonText,
  FormContainer,
  TextHeaderScreen,
  ViewTab,
} from "../../../../../styles/general";
import { deleteAccount } from "./query";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";

interface IForm {
  password: string;
}

const schema = yup
  .object({
    password: yup.string().required(),
  })
  .required();

const DeleteAccountScreen = () => {
  const { goBack } = useNavigation();
  const { theme }: IThemeProvider = useTheme();
  const { setConfirm } = React.useContext(ConfirmContext);
  const { setUser } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  function handleDelete(e: IForm) {
    setConfirm(() => ({
      title: "Deseja excluir sua conta e todos os seus dados?",
      visibility: true,
      callbackFunction: () => submit(e),
    }));
  }

  function submit({ password }: IForm) {
    setLoading(true);
    deleteAccount(password)
      .then(() => {
        setUser(initialUserState);
        Toast.show({
          type: "success",
          text1: "Conta excluída com sucesso",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao excluir a conta",
        });
      })
      .finally(() => setLoading(false));
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
            <Text fontWeight={700}>Excluir Conta</Text>
          </HStack>
          <VStack paddingX={2}>
            <Text fontSize={"md"}>
              Por questões de segurança, informe sua senha abaixo
            </Text>
          </VStack>
          <Center flex={1}>
            <TextInputPassword
              variant="filled"
              control={control}
              name="password"
              placeholder="Senha"
              returnKeyType="done"
              errors={errors.password}
              helperText="Informe sua senha"
            />
          </Center>
          <Button
            variant="outline"
            onPress={handleSubmit(handleDelete)}
            isLoading={loading}
          >
            <ButtonText>Excluir conta</ButtonText>
          </Button>
        </VStack>
      </BackgroundContainer>
    </TouchableWithoutFeedback>
  );
};

export default DeleteAccountScreen;
