import { useContext, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { getData } from "../query";
import { DataContext } from "../../../../../context/Data/dataContext";
import { ChartProps } from "../../../../../components/SegmentChart/types";

export const useData = () => {
  const { isLoading, handleExecute } = usePromise(getData);
  const { data: dataContext } = useContext(DataContext);
  const [data, setData] = useState<ChartProps[]>([]);
  const [emptyText, setEmptyText] = useState("Realize seu primeiro lançamento");
  const [hasSegments, setHasSegments] = useState(false);
  const [hasExpense, setHasExpense] = useState(false);

  async function execute() {
    if (!dataContext.year) return;
    const { hasExpense, expenseBySegment, hasSegments } = await handleExecute(
      dataContext
    );

    setData(hasExpense ? expenseBySegment : []);
    if (!hasSegments) {
      setHasSegments(hasSegments);
      setEmptyText("Nenhum segmento cadastrado");
    }
    if (!hasExpense) {
      setHasExpense(hasExpense);
      setEmptyText("Cadastre sua primeira despesa");
    }
  }

  return {
    isLoading,
    data,
    handleGetData: execute,
    emptyText,
    hasSegments,
    hasExpense,
  };
};
