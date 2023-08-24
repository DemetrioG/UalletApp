import * as yup from "yup";
import { dateValidation } from "../../../../utils/date.helper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CompleteDTO } from "../types";
import { usePromise } from "../../../../hooks/usePromise";
import { updateUserData } from "../querys";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { handleToast } from "../../../../utils/functions.helper";

const schema = yup.object({
  birthdate: yup
    .string()
    .required()
    .min(10)
    .test("date", "Verifique a data informada", (value) =>
      dateValidation(value!)
    ),
  gender: yup.string().nullable().required("Informe seu sexo"),
  profile: yup.string().nullable(),
  income: yup.string().nullable(),
});

const defaultValues: CompleteDTO = {
  birthdate: null,
  gender: null,
  profile: null,
  income: null,
};

export function useFormComplete() {
  const formMethods = useForm<CompleteDTO>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isLoading, handleExecute } = useCreateComplete();

  const handleSubmit = formMethods.handleSubmit(handleExecute);

  return {
    formMethods,
    isLoading,
    handleSubmit,
  };
}

export const useCreateComplete = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { isLoading, handleExecute } = usePromise(updateUserData);

  async function execute(formData: CompleteDTO) {
    handleExecute(formData)
      .then(() => {
        navigate("Home");
        handleToast({
          type: "success",
          text1: "Dados cadastrados com sucesso",
        });
      })
      .catch(() => {
        handleToast({
          type: "error",
          text1: "Erro ao cadastrar as informações",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};
