import { useContext, useEffect, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { getPlanning } from "../query";
import { DataContext } from "../../../../../context/Data/dataContext";
import { PlanningList } from "../types";

export const useGetPlanning = () => {
  const { isLoading, handleExecute } = usePromise(getPlanning);
  const {
    data: { month, year, trigger },
  } = useContext(DataContext);
  const [list, setList] = useState<PlanningList[]>([]);

  async function execute() {
    if (!year) return;
    handleExecute({ month, year }).then(({ hasPlanning, result }) =>
      setList(hasPlanning ? result : [])
    );
  }

  useEffect(() => {
    execute();
  }, [month, year, trigger]);

  return {
    isLoading,
    handleExecute: execute,
    list,
  };
};
