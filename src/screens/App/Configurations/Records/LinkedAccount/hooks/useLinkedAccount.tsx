import { useNavigation } from "@react-navigation/native";
import { usePromise } from "../../../../../../hooks/usePromise";
import {
  checkIfEmailExist,
  createLinkedAccount,
  listLinkedAccounts,
} from "../query";
import { LinkedAccountDTO } from "../types";
import * as yup from "yup";
import { handleToast } from "../../../../../../utils/functions.helper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserInfo } from "../../../DadosCadastrais/InformacoesPessoais/types";
import { useEffect, useState } from "react";

const defaultValues: LinkedAccountDTO = {
  email: null,
};

const schema = yup.object().shape({
  id: yup.string().optional(),
  name: yup
    .string()
    .nullable()
    .when("id", {
      is: (id: string) => !id,
      then: yup
        .string()
        .nullable()
        .required("Informe o e-mail da conta para compartilhar")
        .test("account", "Conta já existente", async (email) => {
          if (!email) return false;
          return await checkIfEmailExist(email);
        }),
      otherwise: yup
        .string()
        .nullable()
        .required("Informe o e-mail da conta para compartilhar"),
    }),
});

export const useFormLinkedAccount = () => {
  const formMethods = useForm<LinkedAccountDTO>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isLoading: isLoadingCreate, handleExecute: handleCreate } =
    useCreateLinkedAccount();

  const onSubmit = formMethods.handleSubmit(handleCreate);

  return {
    formMethods,
    isLoadingCreate,
    handleSubmit: onSubmit,
  };
};

export const useListLinkedAccount = () => {
  const { isLoading, handleExecute } = usePromise(listLinkedAccounts);
  const [list, setList] = useState<UserInfo[]>([]);

  async function execute() {
    const snapshot = await handleExecute();
    const list = snapshot.docs.map((doc) => doc.data()) as UserInfo[];
    return setList(list);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    data: list ?? [],
    handleExecute: execute,
  };
};

export const useCreateLinkedAccount = () => {
  const { isLoading, handleExecute } = usePromise(createLinkedAccount);
  const { goBack } = useNavigation();

  async function execute(formData: LinkedAccountDTO) {
    handleExecute(formData)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Informações compartilhadas com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao compartilhar informações",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};
