import { useEffect, useState } from "react";
import { usePromise } from "../../../../hooks/usePromise";
import { IOption } from "../../../../types/types";
import { listPeriodsToReproduce } from "../query";

export const useFetchable = () => {
  const { isLoading, handleExecute } = usePromise(listPeriodsToReproduce);
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
