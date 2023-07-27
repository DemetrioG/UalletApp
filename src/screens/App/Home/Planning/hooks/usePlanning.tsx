import { useContext, useEffect } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { getPlanning } from "../query";
import { DataContext } from "../../../../../context/Data/dataContext";

export const useGetPlanning = () => {
  const { isLoading, handleExecute } = usePromise(getPlanning);
  const {
    data: { month, year },
  } = useContext(DataContext);

  async function execute() {
    if (!year) return;
    await handleExecute({ month, year }, "Projetado");
  }

  useEffect(() => {
    execute();
  }, [month, year]);

  return {
    isLoading,
    handleExecute: execute,
  };
};
