import { useContext, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { getData } from "../query";
import { DataContext } from "../../../../../context/Data/dataContext";
import { ChartProps } from "../../../../../components/SegmentChart/types";

export const useData = () => {
  const { isLoading, handleExecute } = usePromise(getData);
  const { data: dataContext } = useContext(DataContext);
  const [data, setData] = useState<ChartProps[]>([]);

  async function execute() {
    if (!dataContext.year) return;
    return handleExecute(dataContext).then(({ hasExpense, expenseBySegment }) =>
      setData(hasExpense ? expenseBySegment : [])
    );
  }

  return {
    isLoading,
    data,
    handleGetData: execute,
  };
};
