import { useContext, useEffect, useState } from "react";
import { BalanceProps, DataContext } from "../../../context/Data/dataContext";
import { usePromise } from "../../../hooks/usePromise";
import { getAccountRefs } from "../query";
import { BalanceCardsProps } from "../types";

export const useBalanceCards = (balance: BalanceProps) => {
  const { isLoading, handleExecute } = usePromise(getAccountRefs);
  const {
    data: { trigger },
  } = useContext(DataContext);
  const [data, setData] = useState<BalanceCardsProps[]>([]);

  async function execute() {
    const refs = await handleExecute(balance);
    return setData(refs);
  }

  useEffect(() => {
    execute();
  }, [balance, trigger]);

  return {
    isLoading,
    data,
  };
};
