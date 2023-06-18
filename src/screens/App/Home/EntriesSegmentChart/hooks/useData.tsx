import { useContext, useState } from "react";
import { usePromise } from "../../../../../hooks/usePromise";
import { getData } from "../query";
import { DataContext } from "../../../../../context/Data/dataContext";

export const useData = () => {
  const { isLoading, handleExecute } = usePromise(getData);
  const { data: dataContext } = useContext(DataContext);

  const [data, setData] = useState(defaultData);
  const [empty, setEmpty] = useState(true);

  async function execute() {
    return handleExecute(dataContext, defaultData)
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

const defaultData = [
  {
    label: "Lazer",
    value: 0,
  },
  {
    label: "Investimentos",
    value: 0,
  },
  {
    label: "Educação",
    value: 0,
  },
  {
    label: "Curto e médio prazo",
    value: 0,
  },
  {
    label: "Necessidades",
    value: 0,
  },
];
