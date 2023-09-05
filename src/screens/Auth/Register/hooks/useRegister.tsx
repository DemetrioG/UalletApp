import { useForm } from "react-hook-form";
import * as yup from "yup";
import { RegisterDTO } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePromise } from "../../../../hooks/usePromise";
import { registerUser } from "../query";
import { handleToast } from "../../../../utils/functions.helper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup
      .string()
      .required()
      .matches(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      ),
    confirm: yup.string().required(),
  })
  .required();

export const useFormRegister = () => {
  const formMethods = useForm<RegisterDTO>({
    resolver: yupResolver(schema),
  });

  const { isLoading, handleExecute } = useCreateUser();

  const onSubmit = formMethods.handleSubmit(handleExecute);

  return {
    formMethods,
    isLoading,
    handleSubmit: onSubmit,
  };
};

export const useCreateUser = () => {
  const { isLoading, handleExecute } = usePromise(registerUser);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  async function execute(formData: RegisterDTO) {
    return handleExecute(formData)
      .then(() => {
        handleToast({
          type: "success",
          text1: "Usuário cadastrado com sucesso",
        });
        return navigate("Login", { email: formData.email });
      })
      .catch((error) => {
        return handleToast({
          type: "error",
          text1: error,
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};
