import { useEffect, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import { IOption } from "../../../../types/types";
import { listAccounts } from "../query";

export const useFetchable = () => {
  const { isLoading, handleExecute } = usePromise(listAccounts);
  const [options, setOptions] = useState<IOption[] | null>(null);

  async function execute() {
    handleExecute()
      .then((data) => setOptions(data))
      .catch(() => setOptions(null));
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    options,
  };
};
