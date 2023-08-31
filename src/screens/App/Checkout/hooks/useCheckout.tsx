import { useEffect, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import { getPrice } from "../query";

export const useGetPrice = () => {
  const { isLoading, handleExecute } = usePromise(getPrice);
  const [data, setData] = useState("0,00");

  async function execute() {
    const price = await handleExecute();
    return setData(price);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    data,
  };
};
