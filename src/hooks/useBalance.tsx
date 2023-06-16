import { useContext } from "react";
import { DataContext } from "../context/Data/dataContext";
import { usePromise } from "./usePromise";
import { getBalance } from "../utils/query.helper";

export const useGetBalance = () => {
  const {
    data: { month, year, modality },
    setData,
  } = useContext(DataContext);
  const { isLoading, handleExecute } = usePromise<string>(getBalance);

  async function execute() {
    if (!year) return;
    handleExecute({ month, year, modality }).then((balance) => {
      setData((rest) => ({
        ...rest,
        balance,
      }));
    });
  }

  return {
    isLoading,
    handleGetBalance: execute,
  };
};
