import { useNavigation } from "@react-navigation/native";
import { usePromise } from "../../../../../hooks/usePromise";
import {
  checkIfEmailExist,
  createLinkedAccount,
  deleteLinkedAccount,
  listLinkedAccountsSharedWithYou,
  listLinkedAccountsWhenYouShareData,
} from "../query";
import * as yup from "yup";
import { handleToast } from "../../../../../utils/functions.helper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { LinkedAccountDTO, ListLinkedAccount } from "../types";
import { ConfirmContext } from "../../../../../context/ConfirmDialog/confirmContext";

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

  const [listYouShared, setListYouShared] = useState<ListLinkedAccount[]>([]);
  const [listSharedWithYou, setListSharedWithYou] = useState<
    ListLinkedAccount[]
  >([]);

  async function execute() {
    const youShared = await handleExecuteYouShared();
    setListYouShared(youShared);

    const sharedWithYou = await handleExecuteSharedWithYou();
    setListSharedWithYou(sharedWithYou);
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

export const useHandleConfirmDeleteLinkedAccount = () => {
  const { isLoadingDelete, handleDelete } = useDeleteLinkedAccount();
  const { setConfirm } = useContext(ConfirmContext);

  function execute(formData: ListLinkedAccount) {
    setConfirm(() => ({
      title: "Deseja desvincular seu compartilhamento?",
      visibility: true,
      callbackFunction: () => handleDelete(formData),
    }));
  }

  return {
    isLoadingDelete,
    handleDelete: execute,
  };
};

const useDeleteLinkedAccount = () => {
  const { isLoading, handleExecute } = usePromise(deleteLinkedAccount);
  const { goBack } = useNavigation();

  async function execute(formData: ListLinkedAccount) {
    handleExecute(formData)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Conta desvinculada com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao desvincular conta",
        });
      });
  }

  return {
    isLoadingDelete: isLoading,
    handleDelete: execute,
  };
};
