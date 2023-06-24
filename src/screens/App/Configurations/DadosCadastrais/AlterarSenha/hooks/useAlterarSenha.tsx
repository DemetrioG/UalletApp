import * as yup from "yup";
import { AlterarSenhaDTO } from "../types";
import { UseFormReturn, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePromise } from "../../../../../../hooks/usePromise";
import { changePassword } from "../querys";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

export const useFormAlterarSenha = () => {
  const formMethods = useForm<AlterarSenhaDTO>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return {
    formMethods,
  };
};

export const useChangePassword = (
  formMethods: UseFormReturn<AlterarSenhaDTO>
) => {
  const { isLoading, handleExecute } = usePromise(changePassword);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  async function execute(formData: AlterarSenhaDTO) {
    const changed = await handleExecute(formData);

    if (!changed) {
      Toast.show({
        type: "error",
        text1: "A senha antiga é inválida",
      });
      return formMethods.setError("oldPassword", {
        message: "error",
        type: "value",
      });
    }

    Toast.show({
      type: "success",
      text1: "Senha alterada com sucesso",
    });
    return navigate("Home");
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};
