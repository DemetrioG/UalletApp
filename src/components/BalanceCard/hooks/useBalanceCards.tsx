import { useEffect, useState } from "react";
import { BalanceProps } from "../../../context/Data/dataContext";
import { usePromise } from "../../../hooks/usePromise";
import { getAccountRefs } from "../query";
import { BalanceCardsProps } from "../types";

export const useBalanceCards = (balance: BalanceProps) => {
  const { isLoading, handleExecute } = usePromise(getAccountRefs);
  const [data, setData] = useState<BalanceCardsProps[]>([]);

  async function execute() {
    const refs = await handleExecute(balance);
    return setData(refs);
  }

  useEffect(() => {
    execute();
  }, [balance]);

  return {
    isLoading,
    data,
  };
};
