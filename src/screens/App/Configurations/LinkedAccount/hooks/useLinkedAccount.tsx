import { useNavigation } from "@react-navigation/native";
import { usePromise } from "../../../../../hooks/usePromise";
import {
  checkIfEmailExist,
  createLinkedAccount,
  listLinkedAccountsSharedWithYou,
  listLinkedAccountsWhenYouShareData,
} from "../query";
import * as yup from "yup";
import { handleToast } from "../../../../../utils/functions.helper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserInfo } from "../../DadosCadastrais/InformacoesPessoais/types";
import { useState } from "react";
import { LinkedAccountDTO } from "../types";

const defaultValues: LinkedAccountDTO = {
  email: null,
};

const schema = yup.object().shape({
  id: yup.string().optional(),
  email: yup
    .string()
    .nullable()
    .when("id", {
      is: (id: string) => !id,
      then: yup
        .string()
        .nullable()
        .required("Informe o e-mail da conta para compartilhar")
        .test("account", "Conta não existente", async (email) => {
          if (!email) return false;
          return !(await checkIfEmailExist(email));
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
  const {
    isLoading: isLoadingYouShared,
    handleExecute: handleExecuteYouShared,
  } = usePromise(listLinkedAccountsWhenYouShareData);

  const {
    isLoading: isLoadingSharedWithYou,
    handleExecute: handleExecuteSharedWithYou,
  } = usePromise(listLinkedAccountsSharedWithYou);

  const [listYouShared, setListYouShared] = useState<UserInfo[]>([]);
  const [listSharedWithYou, setListSharedWithYou] = useState<UserInfo[]>([]);

  async function execute() {
    const youShared = await handleExecuteYouShared();
    // setListYouShared(youShared);

    const sharedWithYou = await handleExecuteSharedWithYou();
    // setListSharedWithYou(sharedWithYou);
  }

  return {
    isLoading: isLoadingYouShared || isLoadingSharedWithYou,
    listYouShared: listYouShared ?? [],
    listSharedWithYou: listSharedWithYou ?? [],
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
