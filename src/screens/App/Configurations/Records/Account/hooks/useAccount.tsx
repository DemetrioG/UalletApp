import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ListAccount, AccountDTO } from "../types";
import { usePromise } from "../../../../../../hooks/usePromise";
import {
  createAccount,
  deleteAccount,
  listAccount,
  updateAccount,
} from "../query";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { handleToast } from "../../../../../../utils/functions.helper";

const defaultValues: AccountDTO = {
  name: null,
  balance: null,
};

const schema = yup.object({
  name: yup.string().nullable().required("Informe o nome da conta"),
  balance: yup.number().nullable().required("Informe o saldo inicial da conta"),
});

export const useFormAccount = (id?: string) => {
  const formMethods = useForm<AccountDTO>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isLoading: isLoadingCreate, handleExecute: handleCreate } =
    useCreateAccount();
  const { isLoading: isLoadingUpdate, handleExecute: handleUpdate } =
    useUpdateAccount();

  const onSubmit = formMethods.handleSubmit(handleSubmit);

  function handleSubmit(formData: AccountDTO) {
    if (!id) {
      return handleCreate(formData);
    }
    return handleUpdate(formData, id);
  }

  return {
    formMethods,
    isLoadingCreate,
    isLoadingUpdate,
    handleSubmit: onSubmit,
  };
};

export const useListAccount = () => {
  const { isLoading, handleExecute } = usePromise(listAccount);
  const [list, setList] = useState<ListAccount[]>([]);

  async function execute() {
    const snapshot = await handleExecute();
    const list = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    }) as ListAccount[];
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

export const useCreateAccount = () => {
  const { isLoading, handleExecute } = usePromise(createAccount);
  const { goBack } = useNavigation();

  async function execute(formData: AccountDTO) {
    handleExecute(formData)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Conta cadastrada com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao cadastrar conta",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};

export const useUpdateAccount = () => {
  const { isLoading, handleExecute } = usePromise(updateAccount);
  const { goBack } = useNavigation();

  async function execute(formData: AccountDTO, id: string) {
    handleExecute(formData, id)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Conta atualizada com sucesso",
        });
      })
      .catch(() => {
        return handleToast({
          type: "error",
          text1: "Erro ao atualizar conta",
        });
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};

export const useDeleteAccount = () => {
  const { isLoading, handleExecute } = usePromise(deleteAccount);
  const { goBack } = useNavigation();

  async function execute(id: string) {
    handleExecute(id)
      .then(() => {
        goBack();
        return handleToast({
          type: "success",
          text1: "Conta excluída com sucesso",
        });
      })
      .catch((err) => {
        return handleToast({
          type: "error",
          text1:
            err.message === "Há lançamentos vinculados a esta conta."
              ? err.message
              : "Erro ao excluir conta",
        });
      });
  }

  return {
    isLoadingDelete: isLoading,
    handleDelete: execute,
  };
};
