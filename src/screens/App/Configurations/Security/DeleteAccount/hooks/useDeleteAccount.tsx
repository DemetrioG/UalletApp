import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { usePromise } from "../../../../../../hooks/usePromise";
import { deleteAccount } from "../query";
import { useContext } from "react";
import {
  UserContext,
  initialUserState,
} from "../../../../../../context/User/userContext";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ConfirmContext } from "../../../../../../context/ConfirmDialog/confirmContext";
import { DeleteAccountDTO } from "../types";

const schema = yup
  .object({
    password: yup.string().required(),
  })
  .required();

export const useFormDeleteAccount = () => {
  const formMethods = useForm<DeleteAccountDTO>({
    resolver: yupResolver(schema),
  });

  return {
    formMethods,
  };
};

export const useHandleConfirmDeleteAccount = () => {
  const { isLoading, handleExecute } = useDeleteAccount();
  const { setConfirm } = useContext(ConfirmContext);

  function execute(formData: DeleteAccountDTO) {
    setConfirm(() => ({
      title: "Deseja excluir sua conta e todos os seus dados?",
      visibility: true,
      callbackFunction: () => handleExecute(formData),
    }));
  }

  return {
    isLoading,
    handleDelete: execute,
  };
};

const useDeleteAccount = () => {
  const { isLoading, handleExecute } = usePromise(deleteAccount);
  const { setUser } = useContext(UserContext);

  async function execute({ password }: DeleteAccountDTO) {
    return handleExecute(password)
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
      });
  }

  return {
    isLoading,
    handleExecute: execute,
  };
};
