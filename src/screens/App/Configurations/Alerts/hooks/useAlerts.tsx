import { useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { deleteData, getData } from "../query";
import { AlertDataProps } from "../types";
import firebase from "../../../../../services/firebase";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export const useGetData = () => {
  const { isLoading, handleExecute } = usePromise(getData);

  const [data, setData] = useState<
    AlertDataProps | firebase.firestore.DocumentData
  >();

  async function execute() {
    handleExecute().then((data) => {
      setData(data);
    });
  }

  return {
    isLoading,
    data,
    handleGetData: execute,
  };
};

export const useDelete = () => {
  const { isLoading, handleExecute } = usePromise(deleteData);

  async function execute(i: string, refreshData: () => Promise<void>) {
    handleExecute(i)
      .then(() => {
        refreshData();
        Toast.show({
          type: "success",
          text1: "Alerta excluído com sucesso",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao excluir alerta",
        });
      });
  }

  return {
    isLoading,
    handleDelete: execute,
  };
};
