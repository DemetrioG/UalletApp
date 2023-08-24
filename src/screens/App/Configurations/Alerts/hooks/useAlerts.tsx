import { useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { deleteData, getData } from "../query";
import { AlertDataProps } from "../types";
import { DocumentData } from "firebase/firestore";
import { handleToast } from "../../../../../utils/functions.helper";

export const useGetData = () => {
  const { isLoading, handleExecute } = usePromise(getData);

  const [data, setData] = useState<
    AlertDataProps | DocumentData
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
        handleToast({
          type: "success",
          text1: "Alerta excluído com sucesso",
        });
      })
      .catch(() => {
        handleToast({
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
