import { useContext, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { getData } from "../query";
import { DataContext } from "../../../../../context/Data/dataContext";
import { ChartProps } from "../../../../../components/SegmentChart/types";

export const useData = () => {
  const { isLoading, handleExecute } = usePromise(getData);
  const { data: dataContext } = useContext(DataContext);

  const [data, setData] = useState<ChartProps[]>([]);
  const [empty, setEmpty] = useState(true);

  async function execute() {
    if (!dataContext.year) return;
    return handleExecute(dataContext)
      .then((data) => {
        setEmpty(false);
        if (data) setData(data);
      })
      .catch((e) => {
        if (e.message === "empty") setEmpty(true);
      });
  }

  return {
    isLoading,
    data,
    empty,
    handleGetData: execute,
  };
};
